import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

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
}
