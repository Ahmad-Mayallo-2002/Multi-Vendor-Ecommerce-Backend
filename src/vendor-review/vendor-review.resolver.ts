import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { VendorReviewService } from './vendor-review.service';
import { VendorReview } from './entities/vendor-review.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../assets/enum/role.enum';

@Resolver(() => VendorReview)
export class VendorReviewResolver {
  constructor(private readonly vendorReviewService: VendorReviewService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => VendorReview, { name: 'addVendorReview' })
  async addReview(
    @Args('vendorId', { type: () => String }) vendorId: string,
    @Args('value', { type: () => Float }) value: number,
    @CurrentUser() currentUser: Payload,
  ): Promise<VendorReview> {
    const { sub } = await currentUser;
    return await this.vendorReviewService.addOrUpdateReview(
      sub.userId,
      vendorId,
      value,
    );
  }

  @Query(() => Number, { name: 'getAverageVendorReview' })
  async getAverageReview(
    @Args('vendorId', { type: () => String }) vendorId: string,
  ): Promise<number> {
    return await this.vendorReviewService.averageVendorReview(vendorId);
  }
}
