import { CreatePaymentMethodInput } from './create-payment-method.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePaymentMethodInput extends PartialType(CreatePaymentMethodInput) {
  @Field(() => Int)
  id: number;
}
