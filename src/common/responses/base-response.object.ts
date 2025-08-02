import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class BaseResponse {
  @Field(() => Int, { defaultValue: 200, nullable: true })
  statusCode: number;

  @Field(() => String, { defaultValue: 'Operation is Done', nullable: true })
  message: string;
}
