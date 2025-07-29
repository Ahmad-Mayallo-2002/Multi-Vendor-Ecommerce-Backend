import { registerEnumType } from '@nestjs/graphql';

export enum Payment {
  PAYPAL = 'PAYPAL',
  VISA = 'VISA',
  CREDIT = 'CREDIT',
}

registerEnumType(Payment, {
  name: 'Payment',
  description: 'Enum for Payment Method',
});
