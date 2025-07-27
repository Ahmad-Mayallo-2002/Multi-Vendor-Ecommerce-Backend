import { ObjectType, Field, Float } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('product_reviews')
@ObjectType()
export class ProductReview extends IdClass {
  @Column({ type: 'uuid' })
  @Field()
  userId: string;

  @Column({ type: 'uuid' })
  @Field()
  productId: string;

  @Column({ type: 'decimal', default: 0 })
  @Field(() => Float)
  value: number;

  @OneToOne(() => User, (user) => user.productReview)
  @JoinColumn()
  user: Relation<User>;

  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn()
  product: Relation<Product>;
}
