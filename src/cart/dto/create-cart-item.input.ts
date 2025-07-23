import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, Min, IsNumber, IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class CreateCartItemInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  quantity?: number = 1;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  priceAtPayment: number;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
