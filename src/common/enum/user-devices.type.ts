import { registerEnumType } from '@nestjs/graphql';

export enum UserDevices {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
  WEB = 'WEB',
}

registerEnumType(UserDevices, {
  name: 'UserDevice',
  description: 'Enum for User Device for FCM',
});
