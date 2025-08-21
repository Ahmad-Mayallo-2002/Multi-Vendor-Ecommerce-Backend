import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDeviceTokenInput } from './create-device-token.input';

@InputType()
export class UpdateDeviceTokenInput extends CreateDeviceTokenInput {}
