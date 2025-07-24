import { IsInt, IsNumber, Min } from 'class-validator';
import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCartItemInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  quantity: number = 1;
}
