import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../common/IdDate.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Address } from '../../addresses/entities/address.entity';
import { PaymentMethod } from './payment-method.entity';
import { Status } from '../../common/enum/order-status.enum';

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

  @Column({ type: 'uuid' })
  @Field()
  userId: string;

  @Column({ type: 'uuid' })
  @Field()
  addressId: string;

  @Column({ type: 'uuid', nullable: true })
  @Field()
  paymentId: string;

  // Relations
  @OneToMany(() => OrderItem, (orderItems) => orderItems.order)
  @Field(() => [OrderItem])
  orderItems: Relation<OrderItem[]>;

  @ManyToOne(() => User, (user) => user.order)
  @JoinColumn()
  @Field(() => User)
  user: Relation<User>;

  @OneToOne(() => PaymentMethod, (payment) => payment.order)
  @Field(() => PaymentMethod)
  payment: Relation<PaymentMethod>;

  @ManyToOne(() => Address, (address) => address.order)
  @JoinColumn()
  @Field(() => Address)
  address: Relation<Address>;
}
