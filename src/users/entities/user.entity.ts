import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { IdClass } from '../../assets/IdDate.entity';
import { Role } from '../../assets/enum/role.enum';
import { Vendor } from './vendor.entity';
import { Address } from './address.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { PaymentMethod } from '../../orders/entities/payment.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User extends IdClass {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @Field()
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER, nullable: false })
  @Field(() => Role)
  role: Role;

  // Relations
  @OneToOne(() => Vendor, (vendor) => vendor.userId)
  @Field(() => Vendor)
  vendor: Relation<Vendor>;

  @OneToMany(() => Address, (address) => address.user)
  @JoinTable()
  @Field(() => [Address])
  addresses: Relation<Address[]>;

  @OneToOne(() => Cart, (cart) => cart.user)
  @Field(() => Cart)
  cart: Relation<Cart>;

  @OneToMany(() => PaymentMethod, (payment) => payment.user)
  @Field(() => [PaymentMethod])
  payment: Relation<PaymentMethod[]>;

  @OneToMany(() => Vendor, (vendor) => vendor.users)
  @Field(() => [Vendor])
  vendors: Relation<Vendor[]>;
}
