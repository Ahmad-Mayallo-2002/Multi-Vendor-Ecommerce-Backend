import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity, JoinTable, ManyToOne, Relation } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity({ name: 'orderItems' })
@ObjectType()
export class OrderItem extends IdClass {
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

  @Column({ type: 'uuid', nullable: true })
  @Field()
  productId: string;

  @Column({ type: 'uuid', nullable: true })
  @Field()
  orderId: string;

  // Relations
  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinTable()
  @Field(() => Product)
  product: Relation<Product>;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @Field(() => Order)
  order: Relation<Order>;
}
