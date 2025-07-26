import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FollowingService } from './following.service';
import { Following } from './entities/following.entity';
import { CreateFollowingInput } from './dto/create-following.input';
import { FollowingsAndCount } from '../assets/objectTypes/following.type';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Role } from '../assets/enum/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { SortEnum } from '../assets/enum/sort.enum';

@Resolver(() => Following)
export class FollowingResolver {
  constructor(private readonly followingService: FollowingService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Query(() => FollowingsAndCount, { name: 'getVendorFollowers' })
  async getVendorFollowers(
    @Args('vendorId', { type: () => String }) vendorId: string,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByCreated', { type: () => SortEnum }) sortByCreated: SortEnum,
  ): Promise<FollowingsAndCount> {
    return await this.followingService.getVendorFollowers(
      vendorId,
      take,
      skip,
      sortByCreated,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => FollowingsAndCount, { name: 'getUserFollowings' })
  async getUserFollowings(
    @Args('userId', { type: () => String }) userId: string,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByCreated', { type: () => SortEnum, nullable: true }) sortByCreated: SortEnum,
  ) {
    return await this.followingService.getUserFollowings(
      userId,
      take,
      skip,
      sortByCreated,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
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
