import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/auth/strategies';


@Module({
  imports: [JwtModule.register({})],
  providers: [OpenaiService, AccessTokenStrategy],
  controllers: [OpenaiController]
})
export class OpenaiModule { }
