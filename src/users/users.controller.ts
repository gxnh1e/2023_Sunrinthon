import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetCurrentUserID } from 'src/common/decorators';
import { GetCurrentRoomID } from 'src/common/decorators/GetCurrentRoomID.decorator';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async findAll() {
    return this.usersService.findAll();
  }

  @Post('/createroom')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async createRoom(@GetCurrentUserID() id: string) {
    return this.usersService.createRoom(id);
  }

  @Post('/openroom')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async openroom(@GetCurrentRoomID() id: string) {
    return this.usersService.openRoom(id);
  }

  @Post('/lastmessage')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async lastMessage(@GetCurrentRoomID() id: string) {
    return this.usersService.lastMessage(id);
  }

  @Post('/createmessage')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async createMessage(@GetCurrentUserID() id: string, @GetCurrentRoomID() roomID: string, content: string) {
    return this.usersService.createMessage(id, roomID, content);
  }
}
