import { Field, ObjectType } from '@nestjs/graphql';
import { Order } from '../../orders/entities/order.entity';

@ObjectType()
export class OrderResponse {
  @Field(() => Order)
  order: Order;

  @Field()
  clientSecret: string;

  @Field()
  paymentIntentId: string;
}
