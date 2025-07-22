import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Cart } from './cart.entity';

// Scalar

@Entity({ name: 'cartItems' })
@ObjectType()
export class CartItem extends IdClass {
  @Column({ type: 'int', default: 1 })
  @Field(() => Int)
  quantity: number;

  @Column({
    type: 'decimal',
    transformer: {
      to: (value: number) => Math.round(value * 100),
      from: (value: number) => value / 100,
    },
  })
  @Field(() => Float)
  priceAtPayment: number;

  // Relations
  @ManyToOne(() => Product, (product) => product.cartItems)
  @Field(() => Product)
  product: Relation<Product>;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @Field(() => Cart)
  cart: Relation<Cart>;
}
