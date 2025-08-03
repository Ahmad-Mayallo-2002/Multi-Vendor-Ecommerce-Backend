import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from './base-response.object';
import { Vendor } from '../../vendors/entities/vendor.entity';

@ObjectType()
export class VendorsResponse extends BaseResponse {
  @Field(() => [Vendor])
  data: Vendor[];
}

@ObjectType()
export class VendorResponse extends BaseResponse {
  @Field(() => Vendor)
  data: Vendor;
}
