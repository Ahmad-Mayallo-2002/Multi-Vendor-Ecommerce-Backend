import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity, JoinTable, ManyToOne, Relation } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Cart } from './cart.entity';

@Entity({ name: 'cartItems' })
@ObjectType()
export class CartItem extends IdClass {
  @Column({ type: 'int', nullable: false, default: 1 })
  @Field(() => Int)
  quantity: number;

  @Column({ type: 'decimal', nullable: false })
  @Field(() => Float)
  priceAtPayment: number;

  // Relations
  @ManyToOne(() => Product, (product) => product.items)
  @JoinTable()
  @Field(() => Product)
  product: Relation<Product>;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @Field(() => Cart)
  cart: Relation<Cart>;
}
