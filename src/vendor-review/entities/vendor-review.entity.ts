import { ObjectType, Field, Float } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

@Entity({ name: 'vendorReviews' })
@ObjectType()
export class VendorReview extends IdClass {
  @Column({ type: 'uuid' })
  @Field()
  userId: string;

  @Column({ type: 'uuid' })
  @Field()
  vendorId: string;

  @Column({ type: 'decimal', default: 0 })
  @Field(() => Float)
  value: number;

  @OneToOne(() => User, (user) => user.vendorReview)
  @JoinColumn()
  user: Relation<User>;

  @ManyToOne(() => Vendor, (vendor) => vendor.reviews)
  @JoinColumn()
  vendor: Relation<Vendor>;
}
