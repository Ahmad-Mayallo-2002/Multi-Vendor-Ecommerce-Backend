import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, MaxLength, IsUUID } from 'class-validator';

@InputType()
export class CreateAddressInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  country: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  city: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  state: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;
}
