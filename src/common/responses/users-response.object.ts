import { Field, ObjectType } from "@nestjs/graphql";
import { BaseResponse } from "./base-response.object";
import { User } from "../../users/entities/user.entity";

@ObjectType()
export class UserResponse extends BaseResponse {
    @Field(() => User)
    data: User;
}

@ObjectType()
export class UsersResponse extends BaseResponse {
  @Field(() => [User])
  data: User[];
}