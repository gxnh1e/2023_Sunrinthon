

import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/Register.Dto';
import { LoginDto } from './dto/Login.Dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { use } from 'passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly config: ConfigService) { }

  @Post('/register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    const Tokens = await this.authService.register(body);

    res.cookie('auth-tokens', Tokens, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      domain: 'nabomhalang.com'
    });

    return res.json({ accessToken: Tokens.accessToken, message: "User registered successfully" });
  }

  @Post('/login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const Tokens = await this.authService.login(body);

    res.cookie('auth-tokens', Tokens, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      domain: 'nabomhalang.com'
    });

    return res.json({ accessToken: Tokens.accessToken, message: "User registered successfully" });
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  googleAuth() { }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const Tokens = await this.authService.googleLogin(req.user.email[0].value, `${req.user?.username?.familyName}${req.user?.username?.givenName}`);

    res.cookie('auth-tokens', Tokens, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      domain: 'nabomhalang.com'
    });

    res.redirect(this.config.get('FRONT_URL'));
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req.user.id);

    res.clearCookie('auth-tokens', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: 'nabomhalang.com'
    });

    return res.json({ message: "User logged out successfully" });
  }
}
