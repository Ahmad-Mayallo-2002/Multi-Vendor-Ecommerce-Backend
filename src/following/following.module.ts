import { Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingResolver } from './following.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Following } from './entities/following.entity';
import { User } from '../users/entities/user.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [FollowingResolver, FollowingService, JwtService],
  imports: [TypeOrmModule.forFeature([Following, User, Vendor])],
})
export class FollowingModule {}
