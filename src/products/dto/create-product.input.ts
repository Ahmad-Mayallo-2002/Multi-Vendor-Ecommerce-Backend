import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Min,
  IsInt,
} from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => GraphQLUpload)
  image: Promise<FileUpload>;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  stock: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  discount: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  vendorId: string;
}
