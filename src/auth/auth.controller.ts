

import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/Auth.dto';
import { Public, GetCurrentUserID, GetCurrentUser } from "../common/decorators";
import { RefreshTokenGuard } from "../common/guards"
import { Response } from 'express';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: RegisterDto })
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.register(body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      domain: 'nabomhalang.com'
    });

    return res.json({ accessToken: accessToken, message: "User registered successfully" });
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      domain: 'nabomhalang.com'
    });

    return res.json({ accessToken: accessToken, message: "User logged in successfully" });
  }

  @Post('/logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserID() id: string, @Res() res: Response) {
    if (this.authService.logout(id)) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: 'nabomhalang.com'
      });
      return res.json({ message: "User logged out successfully" });
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Public()
  @Post('/refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetCurrentUserID() id: string,
    @GetCurrentUser('refreshToken') refreshTokens: string,
    @Res() res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(id, refreshTokens);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      domain: 'nabomhalang.com'
    });

    return res.json({ accessToken: accessToken, message: "User refreshed successfully" });
  }
}
