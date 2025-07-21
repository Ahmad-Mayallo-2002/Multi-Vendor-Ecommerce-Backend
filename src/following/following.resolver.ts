import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FollowingService } from './following.service';
import { Following } from './entities/following.entity';
import { CreateFollowingInput } from './dto/create-following.input';
import { FollowingsAndCount } from '../assets/objectTypes/following.type';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Role } from '../assets/enum/role.enum';
import { Roles } from '../auth/decorators/role.decorator';

@Resolver(() => Following)
export class FollowingResolver {
  constructor(private readonly followingService: FollowingService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Query(() => FollowingsAndCount, { name: 'getVendorFollowers' })
  async getVendorFollowers(
    @Args('vendorId', { type: () => String }) vendorId: string,
  ): Promise<FollowingsAndCount> {
    return await this.followingService.getVendorFollowers(vendorId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Query(() => FollowingsAndCount, { name: 'getUserFollowings' })
  async getUserFollowings(
    @Args('userId', { type: () => String }) userId: string,
  ) {
    return await this.followingService.getUserFollowings(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => Following, { name: 'addFollowing' })
  async addFollowing(@Args('input') input: CreateFollowingInput) {
    return await this.followingService.addFollowing(input);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => Boolean, { name: 'cancelFollowing' })
  async cancelFollowing(
    @Args('vendorId', { type: () => String }) vendorId: string,
  ) {
    return await this.followingService.cancelFollowing(vendorId);
  }
}
