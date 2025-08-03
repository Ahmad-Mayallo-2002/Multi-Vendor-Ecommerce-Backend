import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from './base-response.object';
import { Cart } from '../../cart/entities/cart.entity';

@ObjectType()
export class CartResponse extends BaseResponse {
  @Field(() => Cart)
  data: Cart;
}

@ObjectType()
export class CartsResponse extends BaseResponse {
  @Field(() => [Cart])
  data: Cart[];
}
