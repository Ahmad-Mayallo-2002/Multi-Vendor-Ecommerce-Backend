import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  USER = 'USER',
  VENDOR = 'VENDOR',
  SUPER_ADMIN = 'SUPER ADMIN',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'Role Enum',
});
