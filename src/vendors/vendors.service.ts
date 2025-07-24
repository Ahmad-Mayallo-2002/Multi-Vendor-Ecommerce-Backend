import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateVendorInput, UpdateVendorInputData } from './dto/update-vendor.input';
import { CloudinaryService } from '../cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { Repository } from 'typeorm';
import { v2 } from 'cloudinary';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor) private readonly vendorRepo: Repository<Vendor>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getVendor(id: string): Promise<Vendor> {
    const vendor = await this.vendorRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!vendor) throw new NotFoundException('This vendor is not found.');
    return vendor;
  }

  async getVendors(): Promise<Vendor[]> {
    const vendors = await this.vendorRepo.find({ relations: ['user'] });
    if (!vendors.length) throw new NotFoundException('No Vendors');
    return vendors;
  }

  async deleteVendor(id: string): Promise<boolean> {
    const vendor = await this.getVendor(id);
    v2.api.delete_resources([vendor.public_id]);
    await this.vendorRepo.delete(id);
    return true;
  }

  async updateVendor(
    id: string,
    input: UpdateVendorInputData,
  ): Promise<boolean> {
    const vendor = await this.getVendor(id);
    if (input.logo) {
      v2.api.delete_resources([vendor.public_id]);
      const { secure_url, public_id } = await this.cloudinaryService.uploadFile(
        await input.logo,
      );
      input.logo = secure_url;
      vendor.public_id = public_id;
    }
    Object.assign(vendor, input);
    await this.vendorRepo.save(vendor);
    return true;
  }

  async approveVendor(vendorId: string, approve: boolean): Promise<string> {
    await this.getVendor(vendorId);
    await this.vendorRepo.update({ id: vendorId }, { isApproved: approve });
    return approve ? 'This Vendor is Approved' : 'This Vendor is not Approved';
  }
}
