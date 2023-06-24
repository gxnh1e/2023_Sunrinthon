import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  if (config.get<string>("NODE_ENV") !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Reiko API')
      .setDescription('Reiko API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }));

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', 'https://www.nabomhalang.com'),
    methods: config.get<string>('CORS_METHODS', 'GET, POST'),
    allowedHeaders: config.get<string>('CORS_HEADERS', 'Content-Type, Accept, Authorization, Set-Cookie, cookie'),
    credentials: config.get<boolean>('CORS_CREDENTIALS', true),
    preflightContinue: config.get<boolean>('CORS_PREFLIGHT', false),
    optionsSuccessStatus: config.get<number>('CORS_OPTIONS_STATUS', 204),
  });

  await app.listen(config.get<number>("PORT", 3000));
  Logger.log(`Server running on http://nabomhalang.com:${config.get<number>("PORT", 3000)} -> ${config.get<string>("APIENDPOINT", "")}`, "Bootstrap");
}

bootstrap();

