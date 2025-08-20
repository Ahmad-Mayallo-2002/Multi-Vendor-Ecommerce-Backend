import { Field, Int, ObjectType } from '@nestjs/graphql';

type ClassType<T = any> = {
  new (...args: any[]): T;
};

@ObjectType()
export class Pagination {
  @Field(() => Boolean, { defaultValue: false })
  prev: boolean;

  @Field(() => Boolean, { defaultValue: false })
  next: boolean;

  @Field(() => Int, { defaultValue: 1, nullable: true })
  currentPage: number;

  @Field(() => Int, { defaultValue: 1, nullable: true })
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
      nullable: isPage,
      defaultValue: {
        prev: false,
        next: false,
        currentPage: 1,
        totalPages: 1,
      },
    })
    pagination?: Pagination;
  }
  return BaseResponse;
}
