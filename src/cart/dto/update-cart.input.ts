import { ArrayNotEmpty, IsNotEmpty, IsPositive } from 'class-validator';
import { Field, Float, InputType } from '@nestjs/graphql';
import { CartItem } from '../entities/cart-item.entity';

@InputType()
export class UpdateCartInput {
  @IsNotEmpty()
  @IsPositive()
  @Field(() => Float)
  totalPrice: number;

  @ArrayNotEmpty()
  @Field(() => [CartItem])
  cartItems: CartItem[];
}
