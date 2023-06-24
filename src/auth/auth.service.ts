import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/Auth.dto';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './interface';
import * as argon from 'argon2';
import { JwtPayload } from './interface/jwtPayload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly JwtService: JwtService,
  ) { }

  async register(body: RegisterDto): Promise<Tokens> {
    const { email, username, password } = body;

    const _q = await this.prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : null,
        ]
      },
    });

    if (_q) throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);

    const user = await this.prisma.user.create({
      data: {
        ...body,
        password: await argon.hash(password),
      }
    });

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefrashTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async login(body: LoginDto): Promise<Tokens> {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new HttpException('Wrong User or Password', HttpStatus.NOT_FOUND);

    const passwordMatch = await argon.verify(user.password, password);
    if (!passwordMatch) throw new HttpException('Wrong User or Password', HttpStatus.BAD_REQUEST);

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefrashTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(id: string): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: id,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
    return true;
  }

  async refresh(id: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      }
    });

    if (!user || !user.refreshToken) throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);

    const refreshTokenMatch = await argon.verify(user.refreshToken, refreshToken);
    if (!refreshTokenMatch) throw new HttpException('Wrong Refresh Token', HttpStatus.BAD_REQUEST);

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefrashTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async generateTokens(id: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      id: id,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      await this.JwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      }),
      await this.JwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      })
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async updateRefrashTokenHash(id: string, refreshTokenHash: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        refreshToken: await argon.hash(refreshTokenHash),
      }
    });
  }
}
