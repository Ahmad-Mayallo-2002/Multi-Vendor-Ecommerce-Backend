import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { FollowingService } from './following.service';
import { Following } from './entities/following.entity';
import { FollowingsAndCount } from '../common/objectTypes/following.type';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Role } from '../common/enum/role.enum';
import { Roles } from '../common/decorators/role.decorator';
import { SortEnum } from '../common/enum/sort.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Payload } from '../common/types/payload.type';
import { BooleanResponse, FollowingResponse, FollowingsAndCountResponse } from '../common/responses/entities-responses.response';


@Resolver(() => Following)
export class FollowingResolver {
  constructor(private readonly followingService: FollowingService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Query(() => FollowingsAndCountResponse, { name: 'getVendorFollowers' })
  async getVendorFollowers(
    @CurrentUser() currentUser: Payload,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByCreated', { type: () => SortEnum }) sortByCreated: SortEnum,
  ) {
    return {
      data: await this.followingService.getVendorFollowers(
        `${currentUser.sub.vendorId}`,
        take,
        skip,
        sortByCreated,
      ),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => FollowingsAndCountResponse, { name: 'getUserFollowings' })
  async getUserFollowings(
    @CurrentUser() currentUser: Payload,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByCreated', { type: () => SortEnum, nullable: true })
    sortByCreated: SortEnum,
  ) {
    return {
      data: await this.followingService.getUserFollowings(
        currentUser.sub.userId,
        take,
        skip,
        sortByCreated,
      ),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => FollowingResponse, { name: 'addFollowing' })
  async addFollowing(
    @Args('vendorId') vendorId: string,
    @Context() context: Payload,
  ) {
    const userId = context.sub.userId;
    return { data: await this.followingService.addFollowing(userId, vendorId) };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => BooleanResponse, { name: 'cancelFollowing' })
  async cancelFollowing(
    @Args('vendorId', { type: () => String }) vendorId: string,
    @Context() context: Payload,
  ) {
    const userId = context.sub.userId;
    return {
      data: await this.followingService.cancelFollowing(userId, vendorId),
    };
  }
}
