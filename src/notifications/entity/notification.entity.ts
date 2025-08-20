import { Field, ObjectType } from '@nestjs/graphql';
import { IdClass } from '../../common/IdDate.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'notifications' })
@ObjectType()
export class Notification extends IdClass {
  @Column({ type: 'varchar', length: 255, default: '' })
  @Field()
  title: string;

  @Column({ type: 'text', default: '' })
  @Field()
  message: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  token_device: string;
}
