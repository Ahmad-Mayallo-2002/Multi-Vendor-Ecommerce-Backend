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
import { Address } from '../../addresses/entities/address.entity';
import { PaymentMethod } from './payment-method.entity';

@Entity({ name: 'orders' })
@ObjectType()
export class Order extends IdClass {
  @Column({
    type: 'decimal',
    transformer: {
      to: (value: number) => Math.round(value * 100),
      from: (value: number) => value / 100,
    },
  })
  @Field(() => Float)
  totalPrice: number;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  userId: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  addressId: string;

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

  @OneToOne(() => Address, (address) => address.order)
  @JoinColumn()
  @Field(() => Address)
  address: Relation<Address>;
}
