import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Following } from '../following/entities/following.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ProductsAndCategories } from '../common/dataloader/products-category.loader';
import { Category } from '../categories/entities/category.entity';

@Module({
  providers: [
    ProductsResolver,
    ProductsService,
    JwtService,
    CloudinaryService,
    ProductsAndCategories,
  ],
  imports: [
    TypeOrmModule.forFeature([Product, Vendor, Following, Category]),
    CloudinaryModule,
  ],
})
export class ProductsModule {}
