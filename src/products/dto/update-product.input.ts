import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class UpdateProductInputData {
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) categoryId?: string;
  @Field(() => Float, { nullable: true }) price?: number;
  @Field(() => Int, { nullable: true }) stock?: number;
  @Field(() => Float, { nullable: true }) discount?: number;
}

@InputType()
export class UpdateProductInput {
  @Field(() => UpdateProductInputData)
  data: UpdateProductInputData;

  @Field(() => GraphQLUpload, { nullable: true })
  image?: Promise<FileUpload>;
}
