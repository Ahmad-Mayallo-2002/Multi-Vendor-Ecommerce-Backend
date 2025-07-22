import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { Status } from '../../assets/enum/order-status.enum';

@InputType()
export class CreateOrderInput {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Field(() => Float)
  totalPrice: number;

  @IsNotEmpty()
  @IsEnum(Status)
  @Field(() => Status)
  status: Status;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  addressId: string;
}
