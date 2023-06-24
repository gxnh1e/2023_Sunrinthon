import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UtilsService } from './utils.service';
import { GetCurrentUser } from 'src/common/decorators';

@ApiTags('utils')
@Controller('api/utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) { }

  @Post('/posts')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  posts() {
    return ['Avatar', 'Avengers'];
  }

  @Post('/userinfo')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  getUsername(@GetCurrentUser('id') id: string) {
    return this.utilsService.getUsername(id);
  }

  @Post('/logincheck')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  logincheck() {
    return { message: "User logged in" };
  }
}
