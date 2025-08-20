import { Module } from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';

@Module({
  providers: [NotificationsService, NotificationResolver, JwtService],
  imports: [TypeOrmModule.forFeature([Notification])],
})
export class NotificaitonModule {}
