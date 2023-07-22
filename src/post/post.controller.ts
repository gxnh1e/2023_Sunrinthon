import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/Post.Dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
  ) { }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getAllPost(): Promise<PostDto[]> {
    return await this.postService.getAllPost();
  }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Body() postDto: PostDto, @Req() req: Request): Promise<PostDto> {
    return await this.postService.createPost(postDto, req.user.id);
  }

@Post('update')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async updatePost(@Body() postDto: PostDto, @Req() req: Request): Promise<PostDto> {
    console.log(req.user.id);
    return await this.postService.updatePost(postDto, req.user.id);
  }

  @Get('get/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getPostById(@Req() req: Request): Promise<PostDto> {
    return await this.postService.getPostById(req.params.id);
  }

  @Get('delete/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async deletePostById(@Req() req: Request): Promise<PostDto> {
    return await this.postService.deletePostById(req.params.id);
  }
}