import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AddressesService } from './addresses.service';
import { Address } from './entities/address.entity';
import { UpdateAddressInput } from './dto/update-address.input';
import { CreateAddressInput } from './dto/create-address.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Payload } from '../common/types/payload.type';

@Resolver(() => Address)
export class AddressesResolver {
  constructor(private readonly addressesService: AddressesService) {}

  // Get all addresses
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => [Address], { name: 'getAddresses' })
  async getAddresses(): Promise<Address[]> {
    return this.addressesService.getAddresses();
  }

  // Get all addresses for a user
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => [Address], { name: 'getUserAddresses' })
  async getUserAddresses(
    @CurrentUser() currentUser: Payload,
  ): Promise<Address[]> {
    const { sub } = currentUser;
    return this.addressesService.getUserAddresses(sub.userId);
  }

  // Get a single address
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => Address, { name: 'getAddress' })
  async getAddress(
    @Args('addressId', { type: () => String }) addressId: string,
  ): Promise<Address> {
    return this.addressesService.getAddress(addressId);
  }

  // Update address
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => Boolean, { name: 'updateAddress' })
  async updateAddress(
    @Args('addressId', { type: () => String }) addressId: string,
    @Args('input') input: UpdateAddressInput,
  ): Promise<boolean> {
    return this.addressesService.updateAddress(addressId, input);
  }

  // Delete address
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => Boolean, { name: 'removeAddress' })
  async removeAddress(
    @Args('addressId', { type: () => String }) addressId: string,
  ): Promise<boolean> {
    return this.addressesService.removeAddress(addressId);
  }

  // Create Address
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => Address, { name: 'createAddress' })
  async createAddress(
    @Args('input') input: CreateAddressInput,
    @CurrentUser() currentUser: Payload,
  ) {
    const { sub } = currentUser;
    return await this.addressesService.createAddress(input, sub.userId);
  }
}
