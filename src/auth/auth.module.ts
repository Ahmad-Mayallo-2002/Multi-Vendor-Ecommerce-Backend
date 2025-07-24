import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../cloudinary.service';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Cart } from '../cart/entities/cart.entity';

@Module({
  providers: [AuthResolver, AuthService, CloudinaryService],
  imports: [
    TypeOrmModule.forFeature([User, Vendor, Cart]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_JWT'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
})
export class AuthModule {}
