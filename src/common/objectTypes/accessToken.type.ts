import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '../enum/role.enum';

@ObjectType()
export class AccessToken {
  @Field()
  id: string;

  @Field()
  token: string;

  @Field(() => Role)
  role: Role;

  @Field({ nullable: true })
  vendorId?: string;
}
