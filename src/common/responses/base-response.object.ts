import { Field, Int, ObjectType } from '@nestjs/graphql';

type ClassType<T = any> = {
  new (...args: any[]): T;
};

export function BaseResponse<T>(
  itemType: ClassType<T>,
  isArray: boolean = false,
  name: string,
) {
  @ObjectType(name, { isAbstract: true })
  abstract class BaseResponse {
    @Field(() => Int, { defaultValue: 200 })
    statusCode?: number;

    @Field(() => String, { defaultValue: 'Operation is Done' })
    message?: string;

    @Field(() => (isArray ? [itemType] : itemType))
    data: T[] | T;
  }
  return BaseResponse;
}
