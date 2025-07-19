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

@Entity({ name: 'carts' })
@ObjectType()
export class Cart extends IdClass {
  @Column({ type: 'decimal', nullable: false })
  @Field(() => Float)
  totalPrice: number;

  // Relations
  @OneToMany(() => CartItem, (items) => items.cart)
  @Field(() => [CartItem])
  items: Relation<CartItem[]>;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  @Field(() => User)
  user: Relation<User>;
}
