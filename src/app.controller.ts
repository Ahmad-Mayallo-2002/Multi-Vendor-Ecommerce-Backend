import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';

@Controller()
export class AppController {
  constructor() {}
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    if (!req.user) return 'No user from google';
    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  @Post('logout')
  async logout(@Query('accessToken') accessToken: string) {
    try {
      await axios.post('https://oauth2.googleapis.com/revoke', null, {
        params: {
          token: accessToken,
        },
      });
      return 'Logout is Done';
    } catch (err: any) {
      console.log(err);
      return err;
    }
  }
}
