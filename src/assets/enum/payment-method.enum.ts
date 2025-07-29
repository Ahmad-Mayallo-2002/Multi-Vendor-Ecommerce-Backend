import { registerEnumType } from '@nestjs/graphql';

export enum Payment {
  PAYPAL = 'PAYPAL',
  VISA = 'VISA',
  CARD = 'CARD',
}

registerEnumType(Payment, {
  name: 'Payment',
  description: 'Enum for Payment Method',
});
