import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExistsPipe } from '../../common/pipes/exists.pipe';
import { Vendor } from '../../vendors/entities/vendor.entity';

@Injectable()
export class VendorExistsPipe extends ExistsPipe<Vendor> {
  constructor(
    @InjectRepository(Vendor)
    repo: Repository<Vendor>,
  ) {
    super(repo, 'Vendor');
  }
}
