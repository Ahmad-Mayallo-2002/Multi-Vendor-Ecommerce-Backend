import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
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

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // Step 1: Get Google login URL
  @Mutation(() => StringResponse)
  async getGoogleAuthUrl() {
    const client_id = '';
    const redirect_uri = '';
    const scope = ['email', 'profile'].join(' ');
    const response_type = 'code';

    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
  }

  // Step 2: Handle callback with code
  @Mutation(() => StringResponse)
  async googleAuthCallback(@Args('code') code: string, @Context() ctx: any) {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL as string,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();

    // Decode User Info From Google
    const userInfoRes = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${tokens.access_token}` } },
    );
    const profile = await userInfoRes.json();

    // Save/Find User in DB Then Return JWT
    const jwt = '';
    return jwt;
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
