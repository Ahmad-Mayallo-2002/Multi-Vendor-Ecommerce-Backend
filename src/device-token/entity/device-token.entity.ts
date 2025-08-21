import { Field, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../common/IdDate.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'device_token' })
@ObjectType()
export class DeviceToken extends IdClass {
  @Column({ type: 'varchar', length: 255, unique: true })
  @Field()
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  token: string;
}
