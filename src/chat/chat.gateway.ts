import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { Req, UseGuards } from '@nestjs/common';
import { AccessTokenSocketGuard } from 'src/common/guards/AccessTokenSocket.guard';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'https://www.nabomhalang.com',
    methods: ['GET', 'POST'],
    credentials: true,
  }
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  connectedUsers: Array<string> = [];

  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) { }

  @UseGuards(AccessTokenSocketGuard)
  @SubscribeMessage('message')
  handleMessage(@Req() req: any, @MessageBody() message: any): void {
    this.usersService.createMessage(req.user.id, req.handshake.headers.roomid, message.data);
    this.server.emit('message', message);
  }
}
