import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Relation } from 'typeorm';
import { Status } from '../../assets/enum/order-status.enum';
import { User } from '../../users/entities/user.entity';
import { Order } from './order.entity';

@Entity({ name: 'paymentMethods' })
@ObjectType()
export class PaymentMethod extends IdClass {
  @Column({ type: 'enum', enum: Status, nullable: false })
  @Field(() => Status)
  method: Status;

  @Column({ type: 'decimal', nullable: false })
  @Field(() => Float)
  totalPrice: number;

  // Relations
  @ManyToOne(() => User, (user) => user.payment)
  @Field(() => User)
  user: Relation<User>;

  @OneToOne(() => Order, order => order.payment)
  @JoinColumn()
  @Field(() => Order)
  order: Relation<Order>;
}
