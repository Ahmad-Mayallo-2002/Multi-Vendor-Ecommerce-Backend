import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notification.service';
import { NotificationInput } from '../common/inputTypes/notification.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import {
  BooleanResponse,
  NotificationResponse,
  NotificationResponses,
  NotificationsResponse,
} from '../common/responses/entities-responses.response';

@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => NotificationResponses, { name: 'sendNotification' })
  async sendNotification(@Args('input') notificationBody: NotificationInput) {
    return {
      data: await this.notificationService.sendFirebaseMessages(
        notificationBody.messages,
        notificationBody.dryRun,
      ),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => NotificationsResponse, { name: 'getNotifications' })
  async getAll(
    @Args('take', { type: () => Int }) take: number,
    @Args('page', { type: () => Int }) page: number,
  ) {
    const { counts, notifications } = await this.notificationService.getAll(
      take,
      page,
    );
    const totalPages = Math.ceil(counts / take);
    return {
      data: notifications,
      pagination: {
        prev: page > 1,
        next: totalPages > page,
        currentPage: page,
        totalPages,
      },
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => NotificationResponse, { name: 'getNotificationById' })
  async getById(@Args('id') id: string) {
    return {
      data: await this.notificationService.getById(id),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => BooleanResponse, { name: 'deleteNotification' })
  async deleteNotification(@Args('id') id: string) {
    return {
      data: await this.notificationService.deleteById(id),
    };
  }
}
