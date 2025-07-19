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
import { Vendor } from './vendor.entity';
import { Address } from './address.entity';

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
}
