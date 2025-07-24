import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  Min,
} from 'class-validator';

@InputType()
export class CreateOrderItemInput {
  @IsInt()
  @Min(1)
  @Field(() => Int)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Field(() => Float)
  priceAtPayment: number;

  @IsNotEmpty()
  @IsUUID()
  @Field(() => String)
  productId: string;

  @IsNotEmpty()
  @IsUUID()
  @Field(() => String)
  userId: string;
}
