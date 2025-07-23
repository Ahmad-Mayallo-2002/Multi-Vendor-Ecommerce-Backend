import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class CreateCartInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
