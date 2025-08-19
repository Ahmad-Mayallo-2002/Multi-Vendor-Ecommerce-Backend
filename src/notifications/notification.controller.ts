import {
  Controller,
  Post,
  Body,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { SendNotificationsDto } from './dto/send-notification.dto';
import { NotificationsService } from './notification.service';
import { getToken } from 'firebase/messaging';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @HttpCode(200) // This decorator ensures a 200 OK status code on success
  async sendNotifications(
    @Body() sendNotificationsDto: SendNotificationsDto,
  ): Promise<BatchResponse> {
    try {
      // Destructure the messages and optional dryRun flag from the DTO
      const { messages, dryRun } = sendNotificationsDto;

      // Call the service method to send the messages
      return await this.notificationsService.sendFirebaseMessages(
        messages,
        dryRun,
      );
    } catch (error) {
      console.error('Error in sendNotifications:', error);
      throw new InternalServerErrorException(
        'An error occurred while sending notifications.',
      );
    }
  }
}
