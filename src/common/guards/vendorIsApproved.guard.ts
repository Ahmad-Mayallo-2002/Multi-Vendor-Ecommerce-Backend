import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Vendor } from '../../vendors/entities/vendor.entity';

export class VendorIsApprovedGuard implements CanActivate {
  constructor(
    @InjectRepository(Vendor) private readonly vendorRepo: Repository<Vendor>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const {
      sub: { userId },
    } = await req?.user;
    const vendor = await this.vendorRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!vendor?.isApproved)
      throw new ForbiddenException('This Vendor is not Approved Yet.');
    return true;
  }
}
