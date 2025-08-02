import { Field, ObjectType } from '@nestjs/graphql';
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

  @Column({ type: 'varchar', nullable: false })
  @Field()
  userId: string;

  // Relations
  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn()
  @Field(() => User)
  user: Relation<User>;

  @OneToMany(() => Order, (order) => order.address)
  @Field(() => [Order])
  order: Relation<Order[]>;
}
