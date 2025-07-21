import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsersResolver, UsersService, JwtService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
