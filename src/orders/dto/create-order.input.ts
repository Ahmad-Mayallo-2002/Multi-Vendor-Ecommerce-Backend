import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Payment } from '../../common/enum/payment-method.enum';

@InputType()
export class CreateOrderInput {
  @IsNotEmpty()
  @IsEnum(Payment)
  @Field(() => Payment)
  paymentMethod: Payment;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  @Field()
  addressId: string;
}
