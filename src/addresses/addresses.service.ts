import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  async getAddresses(): Promise<Address[]> {
    const addresses = await this.addressRepo.find();
    if (!addresses.length) throw new NotFoundException('No Addresses Here');
    return addresses;
  }

  async getUserAddresses(userId: string): Promise<Address[]> {
    const addresses = await this.addressRepo.find({ where: { userId } });
    if (!addresses.length)
      throw new NotFoundException('No Addresses For This User');
    return addresses;
  }

  async getAddress(addressId: string): Promise<Address> {
    const address = await this.addressRepo.findOne({
      where: {
        id: addressId,
      },
    });
    if (!address) throw new NotFoundException('This Address is not Exist.');
    return address;
  }

  async updateAddress(
    addressId: string,
    input: UpdateAddressInput,
  ): Promise<boolean> {
    const address = await this.getAddress(addressId);
    const updated = this.addressRepo.merge(address, input);
    await this.addressRepo.save(updated);
    return true;
  }

  async removeAddress(addressId: string): Promise<boolean> {
    await this.getAddress(addressId);
    await this.addressRepo.delete({ id: addressId });
    return true;
  }

  async createAddress(input: CreateAddressInput, userId: string) {
    const address = this.addressRepo.create({
      ...input,
      userId,
    });
    return await this.addressRepo.save(address);
  }
}
