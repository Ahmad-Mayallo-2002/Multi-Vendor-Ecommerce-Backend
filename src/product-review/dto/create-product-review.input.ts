import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsUUID, Max, Min } from 'class-validator';

@InputType()
export class CreateProductReviewInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsPositive()
  @Min(0)
  @Max(5)
  value: number;
}
