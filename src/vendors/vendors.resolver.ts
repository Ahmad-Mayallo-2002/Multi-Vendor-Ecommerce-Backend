import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendor.entity';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Payload } from '../common/types/payload.type';
import { VendorExistsPipe } from '../common/pipes/vendor-exists.pipe';

@Resolver(() => Vendor)
export class VendorsResolver {
  constructor(private readonly vendorsService: VendorsService) {}

  @Query(() => [Vendor], { name: 'getVendors' })
  async getVendors(): Promise<Vendor[]> {
    return await this.vendorsService.getVendors();
  }

  @Query(() => Vendor, { name: 'getVendor' })
  async getVendor(
    @Args('vendorId', { type: () => String }, VendorExistsPipe)
    vendorId: string,
  ): Promise<Vendor> {
    return await this.vendorsService.getVendor(vendorId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => Boolean, { name: 'updateVendor' })
  async updateVendor(
    @CurrentUser() currentUser: Payload,
    @Args('input', { type: () => UpdateVendorInput })
    input: UpdateVendorInput,
  ): Promise<boolean> {
    const { sub } = currentUser;
    return await this.vendorsService.updateVendor(`${sub.vendorId}`, input);
  }

  @Mutation(() => Boolean, { name: 'removeVendor' })
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  async removeVendor(@CurrentUser() currentUser: Payload) {
    const { sub } = currentUser;
    return await this.vendorsService.deleteVendor(`${sub.vendorId}`);
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
