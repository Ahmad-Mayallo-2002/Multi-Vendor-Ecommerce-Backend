import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import { Payment } from '../../assets/enum/payment-method.enum';
import { Order } from '../../orders/entities/order.entity';

@Entity({ name: 'paymentMethods' })
@ObjectType()
export class PaymentMethod extends IdClass {
  @Column({ type: 'enum', enum: Payment })
  @Field(() => Payment)
  method: Payment;

  @Column({ type: 'decimal' })
  @Field(() => Float)
  totalPrice: number;

  // Relations
  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn()
  @Field(() => Order)
  order: Relation<Order>;
}
