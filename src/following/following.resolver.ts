import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FollowingService } from './following.service';
import { Following } from './entities/following.entity';
import { CreateFollowingInput } from './dto/create-following.input';
import { FollowingsAndCount } from '../assets/objectTypes/following.type';

@Resolver(() => Following)
export class FollowingResolver {
  constructor(private readonly followingService: FollowingService) {}

  @Query(() => FollowingsAndCount, { name: 'getVendorFollowers' })
  async getVendorFollowers(
    @Args('vendorId', { type: () => String }) vendorId: string,
  ): Promise<FollowingsAndCount> {
    return await this.followingService.getVendorFollowers(vendorId);
  }

  @Query(() => FollowingsAndCount, { name: 'getUserFollowings' })
  async getUserFollowings(
    @Args('userId', { type: () => String }) userId: string,
  ) {
    return await this.followingService.getUserFollowings(userId);
  }

  @Mutation(() => Following, { name: 'addFollowing' })
  async addFollowing(@Args('input') input: CreateFollowingInput) {
    return await this.followingService.addFollowing(input);
  }

  @Mutation(() => Boolean, { name: 'cancelFollowing' })
  async cancelFollowing(
    @Args('vendorId', { type: () => String }) vendorId: string,
  ) {
    return await this.followingService.cancelFollowing(vendorId);
  }
}
