import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CategoriesResolver, CategoriesService, JwtService],
  imports: [TypeOrmModule.forFeature([Category])],
})
export class CategoriesModule {}
