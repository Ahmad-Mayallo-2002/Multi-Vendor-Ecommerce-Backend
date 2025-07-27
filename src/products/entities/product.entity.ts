import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { ProductReview } from '../../product-review/entities/product-review.entity';

@Entity({ name: 'products' })
@ObjectType()
export class Product extends IdClass {
  @Column({ type: 'varchar', length: 255 })
  @Field()
  title: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @Column({ type: 'text' })
  @Field()
  image: string;

  @Column({ type: 'text' })
  @Field()
  public_id: string;

  @Column({ type: 'decimal' })
  @Field(() => Float)
  price: number;

  @Column({ type: 'int', default: 1 })
  @Field(() => Int)
  stock: number;

  @Column({ type: 'decimal', default: 0 })
  @Field(() => Float)
  discount: number;

  @Column({ type: 'varchar', nullable: false })
  @Field(() => String)
  categoryId: string;

  @Column({ type: 'varchar', nullable: false })
  @Field(() => String)
  vendorId: string;

  // Relations
  @ManyToOne(() => Category, (category) => category.products)
  @Field(() => Category)
  category: Relation<Category>;

  @ManyToOne(() => Vendor, (vendor) => vendor.products)
  @Field(() => Vendor)
  vendor: Relation<Vendor>;

  @OneToMany(() => CartItem, (cartItems) => cartItems.product)
  @Field(() => [CartItem])
  cartItems: Relation<CartItem[]>;

  @OneToMany(() => OrderItem, (orderItems) => orderItems.product)
  @Field(() => [OrderItem])
  orderItems: Relation<OrderItem[]>;

  @OneToMany(() => ProductReview, (reviews) => reviews.product)
  @Field(() => [ProductReview])
  reviews: Relation<ProductReview[]>;
}
