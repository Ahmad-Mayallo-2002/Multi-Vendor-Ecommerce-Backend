import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductReviewService } from './product-review.service';
import { ProductReview } from './entities/product-review.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProductReviewInput } from './dto/create-product-review.input';
import { Payload } from '../common/types/payload.type';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { BaseResponse } from '../common/responses/base-response.object';

const ProductReviewResponse = BaseResponse(
  ProductReview,
  false,
  'ProductReviewResponse',
);

const AvgProductReviewResponse = BaseResponse(
  Number,
  false,
  'AvgProductReviewResponse',
);

@Resolver(() => ProductReview)
export class ProductReviewResolver {
  constructor(private readonly productReviewService: ProductReviewService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => ProductReviewResponse, { name: 'addProductReview' })
  async addReview(
    @CurrentUser() currentUser: Payload,
    @Args('input') input: CreateProductReviewInput,
  ) {
    const { sub } = currentUser;
    return {
      data: await this.productReviewService.addOrUpdateReview(
        sub.userId,
        input,
      ),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => AvgProductReviewResponse, { name: 'getAvgProductReview' })
  async getAvgReview(
    @Args('productId', { type: () => String })
    productId: string,
  ) {
    return {
      data: await this.productReviewService.averageProductReview(productId),
    };
  }
}
