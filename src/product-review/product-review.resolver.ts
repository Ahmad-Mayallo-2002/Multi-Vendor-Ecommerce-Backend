import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductReviewService } from './product-review.service';
import { ProductReview } from './entities/product-review.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateProductReviewInput } from './dto/create-product-review.input';
import { Payload } from '../assets/types/payload.type';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../assets/enum/role.enum';

@Resolver(() => ProductReview)
export class ProductReviewResolver {
  constructor(private readonly productReviewService: ProductReviewService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => ProductReview, { name: 'addProductReview' })
  async addReview(
    @CurrentUser() currentUser: Payload,
    @Args('input') input: CreateProductReviewInput,
  ): Promise<ProductReview> {
    const { sub } = currentUser;
    return await this.productReviewService.addOrUpdateReview(sub.userId, input);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => Number, { name: 'getAvgProductReview' })
  async getAvgReview(
    @Args('productId', { type: () => String })
    productId: string,
  ) {
    return await this.productReviewService.averageProductReview(productId);
  }
}
