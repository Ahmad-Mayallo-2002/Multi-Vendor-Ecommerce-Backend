import { Field, Float, InputType } from '@nestjs/graphql';
import { Payment } from '../../assets/enum/payment-method.enum';
import { IsEnum, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

@InputType()
export class CreatePaymentMethodInput {
  @IsNotEmpty()
  @IsEnum(Payment)
  @Field(() => Payment)
  method: Payment;

  @IsNotEmpty()
  @IsPositive()
  @Field(() => Float)
  totalPrice: number;

  @IsNotEmpty()
  @IsUUID()
  @Field(() => String)
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  @Field(() => String)
  orderId: string;
}
