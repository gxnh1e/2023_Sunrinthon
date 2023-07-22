import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { QuestionDto } from './dto/Openai.Dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('openai')
export class OpenaiController {
  constructor(
    private readonly openaiService: OpenaiService,
  ) { }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: QuestionDto, @Req() req: Request) {
    console.log('body', body)
    return await this.openaiService.create(req.user.id, body.question);
  }
}
