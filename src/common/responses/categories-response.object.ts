import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from './base-response.object';
import { Category } from '../../categories/entities/category.entity';

@ObjectType()
export class CategoryResponse extends BaseResponse {
  @Field(() => Category)
  data: Category;
}

@ObjectType()
export class CategoriesResponse extends BaseResponse {
  @Field(() => [Category])
  data: Category[];
}
