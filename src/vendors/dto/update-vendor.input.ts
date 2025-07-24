import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class UpdateVendorInputData {
  @Field({ nullable: true }) companyName?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) contactEmail?: string;
  @Field({ nullable: true }) contactPhone?: string;
  @Field(() => GraphQLUpload, { nullable: true })
  logo?: Promise<FileUpload>;
}

@InputType()
export class UpdateVendorInput {
  @Field(() => UpdateVendorInputData)
  data: UpdateVendorInputData;

  @Field(() => GraphQLUpload, { nullable: true })
  logo?: Promise<FileUpload>;
}
