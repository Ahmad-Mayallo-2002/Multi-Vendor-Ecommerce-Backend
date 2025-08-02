import { Role } from '../enum/role.enum';

export type Payload = {
  sub: {
    userId: string;
    role: Role;
    vendorId?: string;
  };
};
