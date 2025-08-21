import { Module } from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { DeviceTokenService } from '../device-token/device-token.service';
import { DeviceToken } from '../device-token/entity/device-token.entity';
import { User } from '../users/entities/user.entity';

@Module({
  providers: [NotificationsService, NotificationResolver, JwtService, DeviceTokenService],
  imports: [TypeOrmModule.forFeature([Notification, DeviceToken, User])],
})
export class NotificaitonModule {}
