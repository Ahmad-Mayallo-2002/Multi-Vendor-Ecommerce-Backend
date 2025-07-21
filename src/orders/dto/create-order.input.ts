import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class CreateOrderInput {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Field(() => Float)
  totalPrice: number;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  addressId: string;
}
