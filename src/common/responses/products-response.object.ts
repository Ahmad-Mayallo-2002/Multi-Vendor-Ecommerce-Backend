import { Field, ObjectType } from "@nestjs/graphql";
import { BaseResponse } from "./base-response.object";
import { Product } from "../../products/entities/product.entity";

@ObjectType()
export class ProductResponse extends BaseResponse {
  @Field(() => Product)
  data: Product;
}

@ObjectType()
export class ProductsResponse extends BaseResponse {
  @Field(() => [Product])
  data: Product[];
}