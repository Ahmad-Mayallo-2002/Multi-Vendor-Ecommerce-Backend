import { Injectable } from "@nestjs/common";
import { Vendor } from "../entities/vendor.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExistsPipe } from "../../pipes/exists.pipe";

@Injectable()
export class VendorExistsPipe extends ExistsPipe<Vendor> {
  constructor(
    @InjectRepository(Vendor)
    repo: Repository<Vendor>,
  ) {
    super(repo, 'Vendor');
  }
}
