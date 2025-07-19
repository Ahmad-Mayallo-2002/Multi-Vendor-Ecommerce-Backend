import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessAuth {
  @Field(() => String)
  id: string;

  @Field(() => String)
  role: string;

  @Field(() => String)
  token: string;
}
