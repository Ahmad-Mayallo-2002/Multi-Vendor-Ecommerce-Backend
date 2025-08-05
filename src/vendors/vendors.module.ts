import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsResolver } from './vendors.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from '../cloudinary.service';
import { Product } from '../products/entities/product.entity';
import { ProductsLoader } from '../common/dataloader/data-loader.loader';

@Module({
  providers: [
    VendorsResolver,
    VendorsService,
    JwtService,
    CloudinaryService,
    ProductsLoader,
  ],
  imports: [TypeOrmModule.forFeature([Vendor, Product])],
})
export class VendorsModule {}
