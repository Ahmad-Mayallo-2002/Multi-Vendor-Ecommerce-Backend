import { Field, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity, ManyToOne, OneToOne, Relation } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'addresses' })
@ObjectType()
export class Address extends IdClass {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  country: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  city: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  state: string;

  // Relations
  @ManyToOne(() => User, (user) => user.addresses)
  @Field(() => User)
  user: Relation<User>;

  @OneToOne(() => Order, (order) => order.address)
  @Field(() => Order)
  order: Relation<Order>;
}
