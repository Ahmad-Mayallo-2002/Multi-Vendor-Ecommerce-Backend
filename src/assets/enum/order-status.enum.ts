import { registerEnumType } from '@nestjs/graphql';

export enum Status {
  PENDING = 'PENDING',
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  FAILED = 'FAILED',
  REFUND = 'REFUND',
}

registerEnumType(Status, {
  name: 'Status',
  description: 'Order Status Enum',
});
