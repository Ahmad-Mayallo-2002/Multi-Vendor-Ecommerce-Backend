import { Field, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'addresses' })
@ObjectType()
export class Address extends IdClass {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  country: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  city: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  state: string;

  // Relations
  @ManyToOne(() => User, (user) => user.addresses)
  @Field(() => User)
  user: Relation<User>;
}
