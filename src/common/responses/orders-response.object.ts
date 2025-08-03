import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from './base-response.object';
import { Order } from '../../orders/entities/order.entity';

@ObjectType()
export class OrderResponse extends BaseResponse {
  @Field(() => Order)
  data: Order;
}

@ObjectType()
export class OrdersResponse extends BaseResponse {
  @Field(() => [Order])
  data: Order[];
}
