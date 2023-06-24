import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { AccessTokenSoketStrategy } from './strategies';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [ChatGateway, AccessTokenSoketStrategy, UsersService]
})
export class ChatModule { }
