import { Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingResolver } from './following.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Following } from './entities/following.entity';
import { User } from '../users/entities/user.entity';
import { Vendor } from '../vendors/entities/vendor.entity';

@Module({
  providers: [FollowingResolver, FollowingService],
  imports: [
    TypeOrmModule.forFeature([Following, User, Vendor])
  ]
})
export class FollowingModule {}
