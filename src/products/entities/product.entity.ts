import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Vendor } from '../../users/entities/vendor.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';

@Entity({ name: 'products' })
@ObjectType()
export class Product extends IdClass {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  title: string;

  @Column({ type: 'text', nullable: false })
  @Field()
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  image: string;

  @Column({ type: 'decimal', nullable: false })
  @Field(() => Float)
  price: number;

  @Column({ type: 'int', nullable: false, default: 1 })
  @Field(() => Int)
  stock: number;

  @Column({ type: 'decimal', nullable: false, default: 0 })
  @Field(() => Float)
  discount: number;

  // Relations
  @ManyToOne(() => Category, (category) => category.products)
  @JoinTable()
  @Field(() => Category)
  category: Relation<Category>;

  @ManyToOne(() => Vendor, (vendor) => vendor.products)
  @Field(() => Vendor)
  vendorId: Relation<Vendor>;

  @OneToMany(() => CartItem, (items) => items.product)
  @Field(() => [CartItem])
  items: Relation<CartItem[]>;
}
