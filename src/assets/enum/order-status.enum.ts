import { registerEnumType } from '@nestjs/graphql';

export enum Status {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
}
registerEnumType(Status, {
  name: 'Status',
  description: 'Order Status Enum',
});
