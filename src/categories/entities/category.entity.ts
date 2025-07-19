import { ObjectType, Field } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Vendor } from '../../users/entities/vendor.entity';

@Entity({ name: 'categories' })
@ObjectType()
export class Category extends IdClass {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  name: string;

  @Column({ type: 'text', nullable: false })
  @Field()
  description: string;

  // Relations
  @OneToMany(() => Product, (products) => products.category)
  @Field(() => [Product])
  products: Relation<Product[]>;

  @ManyToOne(() => Vendor, (vendor) => vendor.categories)
  @Field(() => Vendor)
  vendor: Relation<Vendor>;
}
