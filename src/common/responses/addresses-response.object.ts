import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from './base-response.object';
import { Address } from '../../addresses/entities/address.entity';

@ObjectType()
export class AddressResponse extends BaseResponse {
  @Field(() => Address)
  data: Address;
}

@ObjectType()
export class AddressesResponse extends BaseResponse {
  @Field(() => [Address])
  data: Address[];
}
