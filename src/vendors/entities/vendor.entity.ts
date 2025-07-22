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
import { Product } from '../../products/entities/product.entity';
import { Following } from '../../following/entities/following.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'vendors' })
@ObjectType()
export class Vendor extends IdClass {
  @Column({ type: 'varchar', length: 255, unique: true })
  @Field()
  companyName: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Field()
  contactEmail: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Field()
  contactPhone: string;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  isApproved: boolean;

  @Column({ type: 'decimal', default: 0 })
  @Field(() => Float)
  rating: number;

  @Column({ type: 'text' })
  @Field()
  logo: string;

  // Relations
  @OneToOne(() => User, (user) => user.vendor, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => User, { nullable: true })
  user: Relation<User>;

  @OneToMany(() => Product, (products) => products.vendorId)
  @Field(() => [Product])
  products: Relation<Product[]>;

  @OneToMany(() => Following, (following) => following.vendor)
  @Field(() => [Following], { nullable: true })
  followers: Relation<Following[]>;
}
