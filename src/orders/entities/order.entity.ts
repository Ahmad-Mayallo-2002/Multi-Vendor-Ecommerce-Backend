import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { PaymentMethod } from './payment.entity';

@Entity({ name: 'orders' })
@ObjectType()
export class Order extends IdClass {
  @Column({ type: 'decimal', nullable: false })
  @Field(() => Float)
  totalPrice: number;

  // Relations
  @OneToMany(() => OrderItem, (orderItems) => orderItems.order)
  @Field(() => [OrderItem])
  orderItems: Relation<OrderItem[]>;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  @Field(() => User)
  user: Relation<User>;

  @OneToOne(() => PaymentMethod, (payment) => payment.order)
  @Field(() => PaymentMethod)
  payment: Relation<Order>;
}