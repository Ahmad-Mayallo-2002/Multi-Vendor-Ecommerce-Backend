import { CreateProductReviewInput } from './create-product-review.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductReviewInput extends PartialType(
  CreateProductReviewInput,
) {}
