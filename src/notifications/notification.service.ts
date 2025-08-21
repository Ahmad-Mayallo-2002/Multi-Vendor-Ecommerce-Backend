import { Injectable, NotFoundException } from '@nestjs/common';
import { mapLimit } from 'async';
import * as firebase from 'firebase-admin';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { chunk } from 'lodash';
import * as shell from 'shelljs';
import { ISendFirebaseMessages } from '../common/interfaces/firebase-message.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entity/notification.entity';
import { DeviceTokenService } from '../device-token/device-token.service';
import { SendNotificationsDto } from './dto/create-notification.dto';
import { DeviceToken } from '../device-token/entity/device-token.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly deviceTokenService: DeviceTokenService,
  ) {
    // For simplicity these credentials are just stored in the environment
    // However these should be stored in a key management system
    const firebaseAdmin = process.env.FIREBASE_ADMIN;
    const firebaseCredentials = JSON.parse(firebaseAdmin as string);
    firebase.initializeApp({
      credential: firebase.credential.cert(firebaseCredentials),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }

  public async sendFirebaseMessages(
    firebaseMessages: ISendFirebaseMessages[],
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    const batchedFirebaseMessages = chunk(firebaseMessages, 500);

    const batchResponses = await mapLimit<
      ISendFirebaseMessages[],
      BatchResponse
    >(
      batchedFirebaseMessages,
      3, // 3 is a good place to start
      async (
        groupedFirebaseMessages: ISendFirebaseMessages[],
      ): Promise<BatchResponse> => {
        try {
          const tokenMessages: firebase.messaging.TokenMessage[] =
            groupedFirebaseMessages.map(({ message, title, token }) => ({
              notification: { body: message, title },
              token,
              apns: {
                payload: {
                  aps: {
                    'content-available': 1,
                  },
                },
              },
            }));

          for (const message of groupedFirebaseMessages) {
            const newMessage = this.notificationRepo.create({
              title: message.title,
              message: message.message,
              token_device: message.token,
            });
            await this.notificationRepo.save(newMessage);
          }

          return await this.sendAll(tokenMessages, dryRun);
        } catch (error) {
          return {
            responses: groupedFirebaseMessages.map(() => ({
              success: false,
              error,
            })),
            successCount: 0,
            failureCount: groupedFirebaseMessages.length,
          };
        }
      },
    );

    return batchResponses.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => {
        return {
          responses: responses.concat(currentResponse.responses),
          successCount: successCount + currentResponse.successCount,
          failureCount: failureCount + currentResponse.failureCount,
        };
      },
      {
        responses: [],
        successCount: 0,
        failureCount: 0,
      } as BatchResponse,
    );
  }

  public async sendUserMessages(
    inputs: SendNotificationsDto,
  ): Promise<BatchResponse> {
    const userIds = inputs.messages.map((m) => m.userId);
    const tokens = (await this.deviceTokenService.getDevicesTokensByUsersIds(
      userIds,
    )) as DeviceToken[];

    const tokenMap: Record<string, string[]> = {};
    for (const dt of tokens) {
      if (!tokenMap[dt.userId]) tokenMap[dt.userId] = [];
      tokenMap[dt.userId].push(dt.token);
    }

    const firebaseMessages: ISendFirebaseMessages[] = inputs.messages.flatMap(
      (input) =>
        (tokenMap[input.userId] || []).map((token) => ({
          title: input.title,
          message: input.message,
          token,
        })),
    );

    return await this.sendFirebaseMessages(firebaseMessages, inputs.dryRun);
  }

  public async sendAll(
    messages: firebase.messaging.TokenMessage[],
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    if (process.env.NODE_ENV === 'local') {
      for (const { notification, token } of messages) {
        shell.exec(
          `echo '{ "aps": { "alert": ${JSON.stringify(notification)}, "token": "${token}" } }' | xcrun simctl push booted com.company.appname -`,
        );
      }
    }
    return firebase.messaging().sendEach(messages, dryRun);
  }

  async getAll(take: number, page: number) {
    const skip = (page - 1) * take;
    const notifications = await this.notificationRepo.find({
      take,
      skip,
    });
    if (!notifications.length)
      throw new NotFoundException('No Notifications Found');
    const counts = await this.notificationRepo.count();
    if (skip > counts) throw new NotFoundException('No Notifications Found');
    return { notifications, counts };
  }

  async getById(id: string): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (!notification) throw new NotFoundException('Notification is not Found');
    return notification;
  }

  async deleteById(id: string): Promise<Boolean> {
    const notification = await this.getById(id);
    await this.notificationRepo.remove(notification);
    return true;
  }
}
