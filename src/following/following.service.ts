import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Following } from './entities/following.entity';
import { Repository } from 'typeorm';
import { CreateFollowingInput } from './dto/create-following.input';
import { FollowingsAndCount } from 'src/assets/objectTypes/following.type';
import { log } from 'console';

@Injectable()
export class FollowingService {
  constructor(
    @InjectRepository(Following)
    private readonly followingRepo: Repository<Following>,
  ) {}

  async getVendorFollowers(vendorId: string): Promise<FollowingsAndCount> {
    const followers = await this.followingRepo.find({
      where: { vendorId },
      relations: ['user'],
    });
    if (!followers.length) throw new NotFoundException('You Have no Followers');
    log(followers.length);
    return {
      followings: followers,
      count: followers.length,
    };
  }

  async getUserFollowings(userId: string): Promise<FollowingsAndCount> {
    const followings = await this.followingRepo.find({
      where: { userId },
      relations: ['vendor'],
    });
    if (!followings.length)
      throw new NotFoundException('You not Follow any Vendor.');
    return { followings: followings, count: followings.length };
  }

  async addFollowing(input: CreateFollowingInput) {
    const currentFollowing = await this.followingRepo.findOne({
      where: {
        userId: input.userId,
        vendorId: input.vendorId,
      },
    });
    if (currentFollowing)
      throw new ConflictException('You Already Follow this Vendor.');
    const newFollowing = this.followingRepo.create(input);
    return await this.followingRepo.save(newFollowing);
  }

  async cancelFollowing(vendorId: string) {
    const currentFollowing = await this.followingRepo.findOne({
      where: {
        vendorId,
      },
    });
    if (!currentFollowing)
      throw new NotFoundException('You Not Follow this Vendor');
    await this.followingRepo.delete({
      vendorId,
    });
    return true;
  }

  async cancelFollower(userId: string) {
    const currentFollower = await this.followingRepo.findOne({
      where: {
        userId,
      },
    });
    if (!currentFollower)
      throw new NotFoundException('This User not Follow You');
    await this.followingRepo.delete({
      userId,
    });
    return true;
  }
}
