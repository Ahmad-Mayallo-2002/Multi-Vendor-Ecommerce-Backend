import { registerEnumType } from '@nestjs/graphql';

export enum Payment {
  CARD = 'CARD',
  PAYPAL = 'PAYPAL',
  CASH = 'CASH',
}

registerEnumType(Payment, {
  name: 'Payment',
  description: 'Enum for Payment Method',
});
