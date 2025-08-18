import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { VendorsService } from './vendors.service';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Payload } from '../common/types/payload.type';
import { Vendor } from './entities/vendor.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsLoader } from '../common/dataloader/products-vendor.loader';
import { BooleanResponse, StringResponse, VendorItem, VendorList } from '../common/responses/entities-responses.response';


@Resolver(() => Vendor)
export class VendorsResolver {
  constructor(
    private readonly vendorsService: VendorsService,
    private readonly productsLoader: ProductsLoader,
  ) {}

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
    @Args('vendorId', { type: () => String })
    vendorId: string,
  ) {
    return { data: await this.vendorsService.getVendor(vendorId) };
  }

  @ResolveField(() => [Product])
  async products(@Parent() vendor: Vendor) {
    return await this.productsLoader.productsByVendor.load(vendor.id);
  }

  // Update Vendor
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
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
  @Roles(Role.VENDOR)
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
