import { Module } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { ProductReviewResolver } from './product-review.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { ProductReview } from './entities/product-review.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ProductReviewResolver, ProductReviewService, JwtService],
  imports: [TypeOrmModule.forFeature([User, Product, ProductReview])],
})
export class ProductReviewModule {}
