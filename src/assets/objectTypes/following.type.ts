import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Following } from '../../following/entities/following.entity';

@ObjectType()
export class FollowingsAndCount {
  @Field(() => [Following])
  followings: Following[];

  @Field(() => Int)
  count: number;
}
