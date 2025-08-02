import { ObjectType, Field } from '@nestjs/graphql';
import { IdClass } from '../../common/IdDate.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'categories' })
@ObjectType()
export class Category extends IdClass {
  @Column({ type: 'varchar', length: 255 })
  @Field()
  name: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  // Relations
  @OneToMany(() => Product, (products) => products.category)
  @Field(() => [Product])
  products: Relation<Product[]>;

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn()
  user: Relation<User>;
}
