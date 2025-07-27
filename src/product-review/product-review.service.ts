import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { ProductReview } from './entities/product-review.entity';
import { CreateProductReviewInput } from './dto/create-product-review.input';

@Injectable()
export class ProductReviewService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductReview)
    private readonly reviewRepo: Repository<ProductReview>,
  ) {}

  private async getProduct(productId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
  }

  async addOrUpdateReview(
    userId: string,
    input: CreateProductReviewInput,
  ): Promise<ProductReview> {
    await this.getProduct(input.productId);

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let review = await this.reviewRepo.findOne({
      where: { userId, productId: input.productId },
    });

    if (review) {
      review.value = input.value;
    } else {
      review = this.reviewRepo.create({
        ...input,
        userId,
      });
    }

    return await this.reviewRepo.save(review);
  }

  async averageProductReview(productId: string): Promise<number> {
    await this.getProduct(productId);
    const avg = await this.reviewRepo.average('value', { productId });
    return Number(avg?.toFixed(2)) || 0;
  }
}
