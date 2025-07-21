import { Field, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

@Entity({ name: 'followings' })
@ObjectType()
export class Following extends IdClass {
  @Column({ type: 'varchar', nullable: false })
  @Field(() => String)
  userId: string;

  @Column({ type: 'varchar', nullable: false })
  @Field(() => String)
  vendorId: string;

  @ManyToOne(() => User, (user) => user.followings)
  @JoinColumn()
  @Field(() => User)
  user: Relation<User>;

  @ManyToOne(() => Vendor, (vendor) => vendor.followers)
  @JoinColumn()
  @Field(() => Vendor)
  vendor: Relation<Vendor>;
}
