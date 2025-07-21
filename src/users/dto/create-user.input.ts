import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Role } from '../../assets/enum/role.enum';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(5, 15)
  username: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;

  @Field(() => Role, { defaultValue: Role.USER })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
