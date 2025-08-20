import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class Message {
  @Field() token: string;
  @Field() title: string;
  @Field() message: string;
}

@InputType()
export class NotificationInput {
  @Field(() => Boolean, { defaultValue: false })
  dryRun: boolean;

  @Field(() => [Message])
  messages: Message[];
}
