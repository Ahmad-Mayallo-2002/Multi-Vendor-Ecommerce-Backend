import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateCartInput {
  @Field(() => Float)
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
