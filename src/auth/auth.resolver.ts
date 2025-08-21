import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { LoginInput } from '../common/inputTypes/login.input';
import { CreateVendorInput } from '../vendors/dto/create-vendor.input';
import {
  Login,
  StringResponse,
  UserSignUp,
  VendorSignUp,
} from '../common/responses/entities-responses.response';
import { OAuth2Client } from 'google-auth-library';
import { AuthResponse } from '../common/objectTypes/google-auth.object';

@Resolver()
export class AuthResolver {
  private oauthClient: OAuth2Client;
  constructor(private readonly authService: AuthService) {
    this.oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  @Mutation(() => AuthResponse, { name: 'googleSignIn' })
  async googleSignIn(@Args('idToken') idToken: string): Promise<AuthResponse> {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error('Invalid Google Token');

    const userProfile = {
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      picture: payload.picture,
    };

    const { user, token } =
      await this.authService.validateGoogleUser(userProfile);

    return {
      user,
      token,
    };
  }

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

  @Mutation(() => StringResponse, { name: 'seedAdmin' })
  async seedAdmin() {
    return {
      data: await this.authService.seedAdmin(),
    };
  }

  @Mutation(() => String, { name: 'sendVerificationCode' })
  async sendVerificationCode(
    @Args('email', { type: () => String }) email: string,
  ) {
    return await this.authService.sendVerificationCode(email);
  }

  @Mutation(() => Boolean, { name: 'compareVerificationCode' })
  async compareVerificationCode(
    @Args('code', { type: () => String }) code: string,
  ) {
    return await this.authService.comapreVerificationCode(code);
  }

  @Mutation(() => Boolean, { name: 'updatePassword' })
  async updatePassword(
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
  ) {
    return await this.authService.updatePassword(oldPassword, newPassword);
  }
}
