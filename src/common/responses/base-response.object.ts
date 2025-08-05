import { Field, Int, ObjectType } from '@nestjs/graphql';

type ClassType<T = any> = {
  new (...args: any[]): T;
};

@ObjectType()
export class Pagination {
  @Field(() => Int, { defaultValue: 0, nullable: true })
  prev: number;

  @Field(() => Int, { defaultValue: 0, nullable: true })
  next: number;

  @Field(() => Int, { defaultValue: 0, nullable: true })
  currentPages: number;

  @Field(() => Int, { defaultValue: 0, nullable: true })
  totalPages: number;
}

export function BaseResponse<T>(
  itemType: ClassType<T>,
  isArray: boolean = false,
  name: string,
  isPage: boolean = true,
) {
  @ObjectType(name, { isAbstract: true })
  abstract class BaseResponse {
    @Field(() => Int, { defaultValue: 200 })
    statusCode?: number;

    @Field(() => String, { defaultValue: 'Operation is Done' })
    message?: string;

    @Field(() => (isArray ? [itemType] : itemType))
    data: T[] | T;

    @Field(() => Pagination, {
      defaultValue: {
        prev: 0,
        next: 0,
        currentPages: 0,
        totalPages: 0,
      },
      nullable: isPage,
    })
    pagination: Pagination;
  }
  return BaseResponse;
}
