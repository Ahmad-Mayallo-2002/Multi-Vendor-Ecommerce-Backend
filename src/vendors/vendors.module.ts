import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsResolver } from './vendors.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from '../cloudinary.service';

@Module({
  providers: [VendorsResolver, VendorsService, JwtService, CloudinaryService],
  imports: [TypeOrmModule.forFeature([Vendor])],
})
export class VendorsModule {}
