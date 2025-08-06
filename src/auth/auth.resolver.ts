import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { User } from '../users/entities/user.entity';
import { LoginInput } from '../common/inputTypes/login.input';
import { AccessToken } from '../common/objectTypes/accessToken.type';
import { CreateVendorInput } from '../vendors/dto/create-vendor.input';
import { Vendor } from '../vendors/entities/vendor.entity';
import { BaseResponse } from '../common/responses/base-response.object';

const UserSignUp = BaseResponse(User, false, 'UserSignUp');
const VendorSignUp = BaseResponse(Vendor, false, 'VendorSignUp');
const Login = BaseResponse(AccessToken, false, 'Login');
const SeedAdminString = BaseResponse(String, false, 'SeedAdminString');

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserSignUp, { name: 'signupUser' })
  async signupUser(@Args('input') input: CreateUserInput) {
    return {
      data: await this.authService.signupUser(input),
    };
  }

  @Mutation(() => VendorSignUp, { name: 'signupVendor' })
  async signupVendor(
    @Args('user') user: CreateUserInput,
    @Args('vendor') vendor: CreateVendorInput,
  ) {
    return {
      data: await this.authService.signupVendor(user, vendor),
    };
  }

  @Mutation(() => Login, { name: 'login' })
  async login(@Args('input') input: LoginInput) {
    return {
      data: await this.authService.login(input),
    };
  }

  @Mutation(() => SeedAdminString, { name: 'seedAdmin' })
  async seedAdmin() {
    return {
      data: await this.authService.seedAdmin(),
    };
  }
}
