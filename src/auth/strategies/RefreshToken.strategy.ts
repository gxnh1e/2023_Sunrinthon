
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtPayload, JwtPayloadWithRefreshToken } from '../interface/jwtPayload.type';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
        const refreshToken = req?.cookies['refreshToken'];
        return refreshToken;
      }]),
      secretOrKey: config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req?.cookies['refreshToken'];


    if (!refreshToken) throw new ForbiddenException('Refresh Token not found');

    return {
      ...payload,
      refreshToken: refreshToken,
    }
  }
}