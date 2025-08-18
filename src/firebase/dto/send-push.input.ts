import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendPushInput {
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) body?: string;
  @Field(() => String, { nullable: true }) dataJson?: string; // send JSON as string or use GraphQL JSON scalar
}
