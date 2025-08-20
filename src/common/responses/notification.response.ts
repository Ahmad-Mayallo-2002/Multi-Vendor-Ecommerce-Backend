import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageResponse {
  @Field(() => Boolean) success: boolean;
  @Field() messageId: string;
}

@ObjectType()
export class NotificationResponse {
  @Field(() => [MessageResponse])
  responses: MessageResponse[];
}
