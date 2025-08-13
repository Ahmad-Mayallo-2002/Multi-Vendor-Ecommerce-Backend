import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsResolver } from './vendors.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Product } from '../products/entities/product.entity';
import { ProductsLoader } from '../common/dataloader/products-vendor.loader';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  providers: [
    VendorsResolver,
    VendorsService,
    JwtService,
    CloudinaryService,
    ProductsLoader,
  ],
  imports: [TypeOrmModule.forFeature([Vendor, Product]), CloudinaryModule],
})
export class VendorsModule {}
