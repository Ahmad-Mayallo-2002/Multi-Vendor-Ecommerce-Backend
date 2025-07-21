import { InputType, PartialType } from '@nestjs/graphql';
import { CreateVendorInput } from './create-vendor.input';

@InputType()
export class UpdateVendorInput extends PartialType(CreateVendorInput) {
  logo: string;
}
