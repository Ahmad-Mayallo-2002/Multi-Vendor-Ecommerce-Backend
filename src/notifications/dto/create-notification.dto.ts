import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class NotificationMessageDto {
  @IsString()
  token: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  message: string;
}

export class SendNotificationsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationMessageDto)
  messages: NotificationMessageDto[];

  @IsBoolean()
  @IsOptional()
  dryRun?: boolean;
}
