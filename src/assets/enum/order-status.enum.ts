import { registerEnumType } from '@nestjs/graphql';

export enum Status {
  PENDING = 'PENDING',
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  FAILED = 'FAILED',
}
registerEnumType(Status, {
  name: 'Status',
  description: 'Order Status Enum',
});
