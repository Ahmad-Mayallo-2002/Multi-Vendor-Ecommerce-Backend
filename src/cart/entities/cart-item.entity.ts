import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../common/IdDate.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Cart } from './cart.entity';

@Entity({ name: 'cart_items' })
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

  @Column({ type: 'varchar' })
  cartId: string;

  @Column({ type: 'varchar' })
  productId: string;

  // Relations
  @ManyToOne(() => Product, (product) => product.cartItems)
  @Field(() => Product)
  product: Relation<Product>;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @Field(() => Cart)
  cart: Relation<Cart>;
}
