import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notification.service';
import { NotificationInput } from '../common/inputTypes/notification.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { NotificationResponses } from '../common/responses/entities-responses.response';

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
}
