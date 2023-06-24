

import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenSoketStrategy extends PassportStrategy(Strategy, 'jwt-socket') {
  @Inject(ConfigService)
  private readonly configService!: ConfigService;

  @Inject(JwtService)
  private readonly jwtService!: JwtService;

  async validate(payload: Socket) {
    const accessToken = payload?.handshake?.headers?.authorization.split(' ')[1];
    let result = null;

    try {
      await this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        ignoreExpiration: true,
      })
      result = jwt.decode(accessToken);

    } catch (e) {
      if (e instanceof TokenExpiredError) {
        console.log(e.message);
      }
    }

    return result;
  }
}

