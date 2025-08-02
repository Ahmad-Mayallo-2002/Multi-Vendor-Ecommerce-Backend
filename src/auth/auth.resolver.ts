import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { User } from '../users/entities/user.entity';
import { LoginInput } from '../common/inputTypes/login.input';
import { AccessToken } from '../common/objectTypes/accessToken.type';
import { CreateVendorInput } from '../vendors/dto/create-vendor.input';
import { Vendor } from '../vendors/entities/vendor.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User, { name: 'signupUser' })
  async signupUser(@Args('input') input: CreateUserInput): Promise<User> {
    return await this.authService.signupUser(input);
  }

  @Mutation(() => Vendor, { name: 'signupVendor' })
  async signupVendor(
    @Args('user') user: CreateUserInput,
    @Args('vendor') vendor: CreateVendorInput,
  ): Promise<Vendor> {
    return await this.authService.signupVendor(user, vendor);
  }

  @Mutation(() => AccessToken, { name: 'login' })
  async login(@Args('input') input: LoginInput): Promise<AccessToken> {
    return await this.authService.login(input);
  }

  @Mutation(() => String, { name: 'seedAdmin' })
  async seedAdmin(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<String> {
    return await this.authService.seedAdmin(userId);
  }
}
