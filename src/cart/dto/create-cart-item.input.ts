import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsInt,
  Min,
  IsNumber,
  IsNotEmpty,
  IsUUID,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateCartItemInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  quantity: number = 1;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
