import { ObjectType, Field, Float } from '@nestjs/graphql';
import { IdClass } from '../../common/IdDate.entity';
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

@Entity({ name: 'carts' })
@ObjectType()
export class Cart extends IdClass {
  @Column({
    type: 'decimal',
    transformer: {
      to: (value: number) => Math.round(value * 100),
      from: (value: number) => value / 100,
    },
    scale: 2,
    precision: 10,
    default: 0,
  })
  @Field(() => Float, { defaultValue: 0 })
  totalPrice: number;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  userId: string;

  // Relations
  @OneToMany(() => CartItem, (cartItems) => cartItems.cart, {
    cascade: true,
  })
  @Field(() => [CartItem])
  cartItems: Relation<CartItem[]>;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  @Field(() => User)
  user: Relation<User>;
}
