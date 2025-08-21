import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NotificationMessageDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  userId: string;

  @IsString()
  @IsOptional()
  @Field()
  title?: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  message: string;
}

@InputType()
export class SendNotificationsDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationMessageDto)
  @Field(() => [NotificationMessageDto])
  messages: NotificationMessageDto[];

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean)
  dryRun?: boolean;
}
