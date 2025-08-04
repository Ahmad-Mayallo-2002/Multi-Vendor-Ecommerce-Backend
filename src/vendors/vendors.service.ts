import { Injectable } from '@nestjs/common';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { CloudinaryService } from '../cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { Repository } from 'typeorm';
import { v2 } from 'cloudinary';
import {
  createGetAllLoader,
  createGetByIdLoader,
} from '../common/utils/dataloader.factory';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor) private readonly vendorRepo: Repository<Vendor>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getVendor(id: string): Promise<Vendor> {
    const vendor = await createGetByIdLoader(this.vendorRepo, []).load(id);
    return vendor as Vendor;
  }

  async getVendors(): Promise<Vendor[]> {
    const vendors = await createGetAllLoader(this.vendorRepo, []).load(
      '__all__',
    );
    return vendors as Vendor[];
  }

  async deleteVendor(id: string): Promise<boolean> {
    const vendor = await this.getVendor(id);
    v2.api.delete_resources([vendor.public_id]);
    await this.vendorRepo.delete(id);
    return true;
  }

  async updateVendor(id: string, input: UpdateVendorInput): Promise<boolean> {
    const vendor = await this.getVendor(id);
    if (input.logo) {
      v2.api.delete_resources([vendor.public_id]);
      const { secure_url, public_id } = await this.cloudinaryService.uploadFile(
        await input.logo,
      );
      input.logo = secure_url;
      vendor.public_id = public_id;
    }
    Object.assign(vendor, input.data);
    await this.vendorRepo.save(vendor);
    return true;
  }

  async approveVendor(vendorId: string, approve: boolean): Promise<string> {
    await this.getVendor(vendorId);
    await this.vendorRepo.update({ id: vendorId }, { isApproved: approve });
    return approve ? 'This Vendor is Approved' : 'This Vendor is not Approved';
  }
}
