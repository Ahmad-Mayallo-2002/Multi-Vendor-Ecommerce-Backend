import { CreateVendorReviewInput } from './create-vendor-review.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVendorReviewInput extends PartialType(
  CreateVendorReviewInput,
) {}
