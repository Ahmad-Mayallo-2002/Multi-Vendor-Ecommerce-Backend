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
import { User } from './user.entity';
import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity({ name: 'vendors' })
@ObjectType()
export class Vendor extends IdClass {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  companyName: string;

  @Column({ type: 'text', nullable: false })
  @Field()
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  contactEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  contactPhone: string;

  @Column({ type: 'boolean', nullable: false })
  @Field(() => Boolean)
  isApproved: boolean;

  @Column({ type: 'decimal', nullable: false, default: 0 })
  @Field(() => Float)
  rating: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  logo: string;

  // Relations
  @OneToOne(() => User, (user) => user.vendor)
  @JoinColumn()
  @Field(() => User)
  userId: Relation<User>;

  @OneToMany(() => Product, (products) => products.vendorId)
  @Field(() => [Product])
  products: Relation<Product[]>;

  @OneToMany(() => User, (user) => user.vendors)
  @Field(() => [User])
  users: Relation<User[]>;

  @OneToMany(() => Category, category => category.vendor)
  @Field(() => [Category])
  categories: Relation<Category[]>;
}
