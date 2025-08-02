import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class GraphQLResponse<TData> {
  @Field(() => Int, { defaultValue: 200 })
  statusCode: number;

  @Field(() => String, { defaultValue: 'Operation is Success' })
  message: string;
}
