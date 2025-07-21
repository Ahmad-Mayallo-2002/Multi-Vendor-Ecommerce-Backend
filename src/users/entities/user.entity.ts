import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { IdClass } from '../../assets/IdDate.entity';
import { Role } from '../../assets/enum/role.enum';
import { Cart } from '../../cart/entities/cart.entity';
import { Following } from '../../following/entities/following.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Address } from '../../addresses/entities/address.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User extends IdClass {
  @Column({ type: 'varchar', length: 255 })
  @Field()
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Field()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  @Field(() => Role)
  role: Role;

  // Relations
  @OneToOne(() => Vendor, (vendor) => vendor.user)
  @Field(() => Vendor)
  vendor: Relation<Vendor>;

  @OneToMany(() => Address, (address) => address.user)
  @JoinTable()
  @Field(() => [Address])
  addresses: Relation<Address[]>;

  @OneToOne(() => Cart, (cart) => cart.user)
  @Field(() => Cart)
  cart: Relation<Cart>;

  @OneToMany(() => Following, (following) => following.user)
  @Field(() => [Following], { nullable: true })
  followings: Relation<Following[]>;

  @OneToMany(() => Category, category => category.user)
  categories: Relation<Category[]>;
}
