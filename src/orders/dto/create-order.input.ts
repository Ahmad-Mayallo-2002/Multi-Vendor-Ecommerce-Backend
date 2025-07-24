import { InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  addressId: string;
}
