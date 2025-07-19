import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'cartItems' })
@ObjectType()
export class CartItem extends IdClass {
  @Column({ type: 'int', nullable: false, default: 1 })
  @Field(() => Int)
  quantity: number;

  @Column({ type: 'decimal', nullable: false })
  @Field(() => Float)
  priceAtPayment: number;

  // Relations
  
}
