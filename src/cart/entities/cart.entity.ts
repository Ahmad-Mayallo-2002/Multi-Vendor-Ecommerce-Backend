import { ObjectType, Field, Float } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { User } from '../../users/entities/user.entity';

// Scalar

@Entity({ name: 'carts' })
@ObjectType()
export class Cart extends IdClass {
  @Column({ type: 'decimal' })
  @Field(() => Float)
  totalPrice: number;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  userId: string;

  // Relations
  @OneToMany(() => CartItem, (cartItems) => cartItems.cart)
  @Field(() => [CartItem])
  cartItems: Relation<CartItem[]>;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  @Field(() => User)
  user: Relation<User>;
}
