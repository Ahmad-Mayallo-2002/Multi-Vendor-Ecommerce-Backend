import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageResponse {
  @Field(() => Boolean) success: boolean;
  @Field() messageId: string;
}

@ObjectType()
export class NotificationMessagesResponse {
  @Field(() => [MessageResponse])
  responses: MessageResponse[];
}
