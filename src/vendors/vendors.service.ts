import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { FileUpload } from 'graphql-upload-ts';
import { CloudinaryService } from '../cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { Repository } from 'typeorm';

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
    await this.getVendor(id);
    await this.vendorRepo.delete(id);
    return true;
  }

  async updateVendor(
    id: string,
    input: UpdateVendorInput,
    logoFile?: FileUpload,
  ): Promise<boolean> {
    const vendor = await this.getVendor(id);
    if (logoFile) {
      const secure_url = await this.cloudinaryService.uploadFile(logoFile);
      input.logo = secure_url;
    }
    Object.assign(vendor, input);
    await this.vendorRepo.save(vendor);
    return true;
  }
}
