import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateVendorInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  companyName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsEmail()
  @MaxLength(255)
  contactEmail: string;

  @Field()
  @IsString()
  @MaxLength(255)
  contactPhone: string;
}
