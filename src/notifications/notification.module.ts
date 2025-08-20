import { Module } from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [NotificationsService, NotificationResolver, JwtService],
})
export class NotificaitonModule {}
