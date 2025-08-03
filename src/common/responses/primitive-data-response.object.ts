import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from './base-response.object';

@ObjectType()
export class StringResponse extends BaseResponse {
  @Field(() => String)
  data: string;
}

@ObjectType()
export class BooleanResponse extends BaseResponse {
  @Field(() => Boolean)
  data: boolean;
}

@ObjectType()
export class NumberResponse extends BaseResponse {
  @Field(() => Int)
  data: number;
}

@ObjectType()
export class FloatResponse extends BaseResponse {
  @Field(() => Float)
  data: number;
}