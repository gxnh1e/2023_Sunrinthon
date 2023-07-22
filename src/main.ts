import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { swagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }));

  // app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', 'https://www.nabomhalang.com'),
    methods: config.get<string>('CORS_METHODS', 'GET, POST'),
    allowedHeaders: config.get<string>('CORS_HEADERS', 'Content-Type, Accept, Authorization, Set-Cookie, cookie'),
    credentials: config.get<boolean>('CORS_CREDENTIALS', true),
    preflightContinue: config.get<boolean>('CORS_PREFLIGHT', false),
    optionsSuccessStatus: config.get<number>('CORS_OPTIONS_STATUS', 204),
  });

  await swagger(app);
  await app.listen(3001);
}

bootstrap();

