import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Repository } from 'typeorm';
import { VendorReview } from './entities/vendor-review.entity';
import { CreateVendorReviewInput } from './dto/create-vendor-review.input';

@Injectable()
export class VendorReviewService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Vendor) private readonly vendorRepo: Repository<Vendor>,
    @InjectRepository(VendorReview)
    private readonly reviewRepo: Repository<VendorReview>,
  ) {}

  private async getVendor(vendorId: string) {
    const vendor = await this.vendorRepo.findOne({
      where: { id: vendorId },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');
  }

  async addOrUpdateReview(
    userId: string,
    input: CreateVendorReviewInput,
  ): Promise<VendorReview> {
    await this.getVendor(input.vendorId);

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let review = await this.reviewRepo.findOne({
      where: { userId, vendorId: input.vendorId },
    });

    if (review) {
      review.value = input.value;
    } else {
      review = this.reviewRepo.create({
        userId,
        vendorId: input.vendorId,
        value: input.value,
      });
    }
    return await this.reviewRepo.save(review);
  }

  async averageVendorReview(vendorId: string): Promise<number> {
    await this.getVendor(vendorId);
    const avg = await this.reviewRepo.average('value', { vendorId });
    return avg ?? 0;
  }
}
