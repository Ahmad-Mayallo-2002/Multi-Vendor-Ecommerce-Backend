import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VendorsService } from './vendors.service';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Payload } from '../common/types/payload.type';
import { VendorExistsPipe } from '../common/pipes/vendor-exists.pipe';
import { Vendor } from './entities/vendor.entity';
import { BaseResponse } from '../common/responses/base-response.object';

const VendorList = BaseResponse(Vendor, true, 'VendorList');
const VendorItem = BaseResponse(Vendor, false, 'VendorItem');
const BooleanResponse = BaseResponse(Boolean, false, 'VendorBooleanResponse');
const StringResponse = BaseResponse(String, false, 'VendorStringResponse');

@Resolver(() => Vendor)
export class VendorsResolver {
  constructor(private readonly vendorsService: VendorsService) {}

  // Get All Vendors
  @Query(() => VendorList, { name: 'getVendors' })
  async getVendors() {
    return {
      data: await this.vendorsService.getVendors(),
    };
  }

  // Get Vendor By Id
  @Query(() => VendorItem, { name: 'getVendor' })
  async getVendor(
    @Args('vendorId', { type: () => String }, VendorExistsPipe)
    vendorId: string,
  ) {
    return { data: await this.vendorsService.getVendor(vendorId) };
  }

  // Update Vendor
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => BooleanResponse, { name: 'updateVendor' })
  async updateVendor(
    @CurrentUser() currentUser: Payload,
    @Args('input', { type: () => UpdateVendorInput })
    input: UpdateVendorInput,
  ) {
    const { sub } = currentUser;
    return {
      data: await this.vendorsService.updateVendor(`${sub.vendorId}`, input),
    };
  }

  // Remove Vendor
  @Mutation(() => BooleanResponse, { name: 'removeVendor' })
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  async removeVendor(@CurrentUser() currentUser: Payload) {
    const { sub } = currentUser;
    return await this.vendorsService.deleteVendor(`${sub.vendorId}`);
  }

  // Approve Vendor By Super Admin
  @Mutation(() => StringResponse, { name: 'approveVendor' })
  @Roles(Role.SUPER_ADMIN)
  async approveVendor(
    @Args('vendorId', { type: () => String }) vendorId: string,
    @Args('approve', { type: () => Boolean }) approve: boolean,
  ) {
    return { data: await this.vendorsService.approveVendor(vendorId, approve) };
  }
}
