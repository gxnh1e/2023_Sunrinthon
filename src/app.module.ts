import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule, loggingMiddleware } from "nestjs-prisma";
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { PostModule } from './post/post.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      }
    }),
    AuthModule,
    PostModule,
    OpenaiModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
