import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VendorReviewService } from './vendor-review.service';
import { VendorReview } from './entities/vendor-review.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { Payload } from '../common/types/payload.type';
import { CreateVendorReviewInput } from './dto/create-vendor-review.input';
import { BaseResponse } from '../common/responses/base-response.object';

const VendorReviewResponse = BaseResponse(
  VendorReview,
  false,
  'VendorReviewResponse',
);
const AvgVendorReviewResponse = BaseResponse(
  Number,
  false,
  'AvgVendorReviewResponse',
);

@Resolver(() => VendorReview)
export class VendorReviewResolver {
  constructor(private readonly vendorReviewService: VendorReviewService) {}

  // Add Review To Vendor
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => VendorReviewResponse, { name: 'addVendorReview' })
  async addReview(
    @Args('vendorId', { type: () => String }) vendorId: string,
    @Args('input') input: CreateVendorReviewInput,
    @CurrentUser() currentUser: Payload,
  ) {
    const { sub } = currentUser;
    return {
      data: await this.vendorReviewService.addOrUpdateReview(sub.userId, input),
    };
  }

  // Get Average Vendor Review
  @Query(() => AvgVendorReviewResponse, { name: 'getAverageVendorReview' })
  async getAverageReview(
    @Args('vendorId', { type: () => String }) vendorId: string,
  ) {
    return {
      data: await this.vendorReviewService.averageVendorReview(vendorId),
    };
  }
}
