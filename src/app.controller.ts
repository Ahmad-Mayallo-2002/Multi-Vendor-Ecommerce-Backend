import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
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

  @Get('logout')
  logout(@Req() req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return { message: 'No token provided' };
    return { message: 'Logged out successfully' };
  }
}
