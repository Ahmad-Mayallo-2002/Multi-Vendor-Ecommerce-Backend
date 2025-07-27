import { Module } from '@nestjs/common';
import { VendorReviewService } from './vendor-review.service';
import { VendorReviewResolver } from './vendor-review.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { VendorReview } from './entities/vendor-review.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [VendorReviewResolver, VendorReviewService, JwtService],
  imports: [TypeOrmModule.forFeature([User, Vendor, VendorReview])],
})
export class VendorReviewModule {}
