import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateDeviceTokenInput {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  token: string;
}
