import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Following } from './entities/following.entity';
import { Repository } from 'typeorm';
import { FollowingsAndCount } from 'src/common/objectTypes/following.object';
import { SortEnum } from '../common/enum/sort.enum';

@Injectable()
export class FollowingService {
  constructor(
    @InjectRepository(Following)
    private readonly followingRepo: Repository<Following>,
  ) {}

  async getVendorFollowers(
    vendorId: string,
    take: number,
    skip: number,
    sortByCreated: SortEnum,
  ): Promise<FollowingsAndCount> {
    let order: Record<string, string> = {};
    if (sortByCreated) order.createdAt = sortByCreated;
    const followers = await this.followingRepo.find({
      where: { vendorId },
      relations: ['user'],
      take,
      skip,
      order,
    });
    if (!followers.length) throw new NotFoundException('You Have no Followers');
    return {
      followings: followers,
      count: followers.length,
    };
  }

  async getUserFollowings(
    userId: string,
    take: number,
    skip: number,
    sortByCreated: SortEnum,
  ): Promise<FollowingsAndCount> {
    let order: Record<string, string> = {};
    if (sortByCreated) order.createdAt = sortByCreated;
    const followings = await this.followingRepo.find({
      where: { userId },
      relations: ['vendor'],
      take,
      skip,
      order,
    });
    if (!followings.length)
      throw new NotFoundException('You not Follow any Vendor.');
    return { followings: followings, count: followings.length };
  }

  async addFollowing(userId: string, vendorId: string) {
    const currentFollowing = await this.followingRepo.findOne({
      where: {
        userId: userId,
        vendorId: vendorId,
      },
    });
    if (currentFollowing)
      throw new ConflictException('You Already Follow this Vendor.');
    const newFollowing = this.followingRepo.create({ userId, vendorId });
    return await this.followingRepo.save(newFollowing);
  }

  async cancelFollowing(userId: string, vendorId: string) {
    const currentFollowing = await this.followingRepo.findOne({
      where: {
        vendorId,
        userId,
      },
    });
    if (!currentFollowing)
      throw new NotFoundException('You Not Follow this Vendor');
    await this.followingRepo.delete({
      vendorId,
      userId,
    });
    return true;
  }
}
