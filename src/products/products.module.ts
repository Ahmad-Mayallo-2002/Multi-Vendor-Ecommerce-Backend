import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from '../cloudinary.service';

@Module({
  providers: [ProductsResolver, ProductsService, JwtService, CloudinaryService],
  imports: [TypeOrmModule.forFeature([Product])],
})
export class ProductsModule {}
