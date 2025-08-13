import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { JwtService } from '@nestjs/jwt';
import { ProductsAndCategories } from '../common/dataloader/products-category.loader';
import { Product } from '../products/entities/product.entity';

@Module({
  providers: [
    CategoriesResolver,
    CategoriesService,
    JwtService,
    ProductsAndCategories,
  ],
  imports: [TypeOrmModule.forFeature([Category, Product])],
})
export class CategoriesModule {}
