import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendor.entity';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../assets/enum/role.enum';

@Resolver(() => Vendor)
export class VendorsResolver {
  constructor(private readonly vendorsService: VendorsService) {}

  @Query(() => [Vendor], { name: 'getVendors' })
  async getVendors(): Promise<Vendor[]> {
    return await this.vendorsService.getVendors();
  }

  @Query(() => Vendor, { name: 'getVendor' })
  async getVendor(
    @Args('vendorId', { type: () => String }) vendorId: string,
  ): Promise<Vendor> {
    return await this.vendorsService.getVendor(vendorId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => Boolean, { name: 'updateVendor' })
  async updateVendor(
    @Args('vendorId', { type: () => String }) vendorId: string,
    @Args('input', { type: () => UpdateVendorInput })
    input: UpdateVendorInput,
  ): Promise<boolean> {
    return await this.vendorsService.updateVendor(vendorId, input);
  }

  @Mutation(() => Boolean, { name: 'removeVendor' })
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  async removeVendor(
    @Args('vendorId', { type: () => String }) vendorId: string,
  ) {
    return await this.vendorsService.deleteVendor(vendorId);
  }

  @Mutation(() => String, { name: 'approveVendor' })
  @Roles(Role.SUPER_ADMIN)
  async approveVendor(
    @Args('vendorId', { type: () => String }) vendorId: string,
    @Args('approve', { type: () => Boolean }) approve: boolean,
  ) {
    return await this.vendorsService.approveVendor(vendorId, approve);
  }
}
