import { Field, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../common/IdDate.entity';
import { Column, Entity, Index, ManyToOne, Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserDevices } from '../../common/enum/user-devices.type';

@Entity('user_devices')
@ObjectType()
export class UserDevice extends IdClass {
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @Field(() => User)
  user: Relation<User>;

  @Index({ unique: true })
  @Column({ type: 'text' })
  @Field(() => String)
  fcmToken: string;

  @Column({ type: 'enum', enum: UserDevices, nullable: true })
  @Field(() => UserDevices)
  platform?: UserDevices;

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  active: boolean;
}
