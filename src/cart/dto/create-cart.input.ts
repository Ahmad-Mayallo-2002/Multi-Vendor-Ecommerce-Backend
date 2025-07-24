import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

@InputType()
export class CreateCartInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @Field(() => Float, { defaultValue: 0 })
  @IsPositive()
  totalPrice: number = 0;
}
