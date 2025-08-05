import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AddressesService } from './addresses.service';
import { UpdateAddressInput } from './dto/update-address.input';
import { CreateAddressInput } from './dto/create-address.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Payload } from '../common/types/payload.type';
import { BaseResponse } from '../common/responses/base-response.object';
import { Address } from './entities/address.entity';

const AddressListResponse = BaseResponse(Address, true, 'AddressesList');
const AddressResponse = BaseResponse(Address, false, 'AddressItem');
const BooleanResponse = BaseResponse(Boolean, false, 'AddressBoolean');

@Resolver()
export class AddressesResolver {
  constructor(private readonly addressesService: AddressesService) {}

  // Get all addresses
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => AddressListResponse, { name: 'getAddresses' })
  async getAddresses() {
    return { data: await this.addressesService.getAddresses() };
  }

  // Get all addresses for a user
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => AddressListResponse, { name: 'getUserAddresses' })
  async getUserAddresses(@CurrentUser() currentUser: Payload) {
    const { sub } = currentUser;
    return {
      data: await this.addressesService.getUserAddresses(sub.userId),
    };
  }

  // Get a single address
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => AddressResponse, { name: 'getAddress' })
  async getAddress(
    @Args('addressId', { type: () => String }) addressId: string,
  ) {
    return {
      data: await this.addressesService.getAddress(addressId),
    };
  }

  // Update address
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => BooleanResponse, { name: 'updateAddress' })
  async updateAddress(
    @Args('addressId', { type: () => String }) addressId: string,
    @Args('input') input: UpdateAddressInput,
  ) {
    return {
      data: await this.addressesService.updateAddress(addressId, input),
    };
  }

  // Delete address
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => BooleanResponse, { name: 'removeAddress' })
  async removeAddress(
    @Args('addressId', { type: () => String }) addressId: string,
  ) {
    return {
      data: await this.addressesService.removeAddress(addressId),
    };
  }

  // Create Address
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => AddressResponse, { name: 'createAddress' })
  async createAddress(
    @Args('input') input: CreateAddressInput,
    @CurrentUser() currentUser: Payload,
  ) {
    const { sub } = currentUser;
    return {
      data: await this.addressesService.createAddress(input, sub.userId),
    };
  }
}
