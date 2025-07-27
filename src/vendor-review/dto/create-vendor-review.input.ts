import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsUUID, Max, Min } from 'class-validator';

@InputType()
export class CreateVendorReviewInput {
  @IsNotEmpty()
  @IsPositive()
  @Max(5)
  @Min(0)
  @Field(() => Float)
  value: number;

  @IsNotEmpty()
  @IsUUID()
  vendorId: string;
}
