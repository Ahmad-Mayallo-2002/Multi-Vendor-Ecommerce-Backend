import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendor.entity';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

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

  @Mutation(() => Boolean, { name: 'updateVendor' })
  async updateVendor(
    @Args('vendorId', { type: () => String }) vendorId: string,
    @Args('input') input: UpdateVendorInput,
    @Args('logo', { type: () => GraphQLUpload, nullable: true })
    logo: FileUpload,
  ): Promise<boolean> {
    return await this.vendorsService.updateVendor(vendorId, input, logo);
  }

  @Mutation(() => Boolean, { name: 'removeVendor' })
  async removeVendor(
    @Args('vendorId', { type: () => String }) vendorId: string,
  ) {
    return await this.vendorsService.deleteVendor(vendorId);
  }
}
