import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from '../cloudinary.service';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Following } from '../following/entities/following.entity';

@Module({
  providers: [ProductsResolver, ProductsService, JwtService, CloudinaryService],
  imports: [TypeOrmModule.forFeature([Product, Vendor, Following])],
})
export class ProductsModule {}
