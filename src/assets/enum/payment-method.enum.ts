import { registerEnumType } from '@nestjs/graphql';

export enum Payment {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  CASH = 'CASH',
}

registerEnumType(Payment, {
  name: 'Payment',
  description: 'Enum for Payment Method',
});
