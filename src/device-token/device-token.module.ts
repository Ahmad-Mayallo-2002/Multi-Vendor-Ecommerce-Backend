import { Module } from '@nestjs/common';
import { DeviceTokenService } from './device-token.service';
import { DeviceTokenResolver } from './device-token.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from './entity/device-token.entity';
import { User } from '../users/entities/user.entity';

@Module({
  providers: [DeviceTokenService, DeviceTokenResolver],
  imports: [TypeOrmModule.forFeature([DeviceToken, User])],
})
export class DeviceTokenModule {}
