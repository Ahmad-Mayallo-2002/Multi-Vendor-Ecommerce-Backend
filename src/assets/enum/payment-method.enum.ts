import { registerEnumType } from '@nestjs/graphql';

export enum Payment {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  CASH = 'CASH',
}

registerEnumType(Payment, {
  name: 'Payment',
  description: 'Enum for Payment Method',
});
