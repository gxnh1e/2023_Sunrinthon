import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PostDto } from './dto/Post.Dto';


@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) { }
  async createPost({ content }: PostDto, id: string): Promise<any> {
  }

  async updatePost({ content }: PostDto, id: string): Promise<PostDto> {
    const findPost = await this.prisma.post.findFirst({
      where: { authorId: id },
    });
    if (findPost.authorId !== id) {
      throw new HttpException('Not Found', HttpStatus.BAD_REQUEST);
    }

    return await this.prisma.post.update({
      where: { id: findPost.id },
      data: {
        content,
      },
    });
  }

  async getAllPost(): Promise<PostDto[]> {
    return await this.prisma.post.findMany({
      include: {
        author: true,
      },
    });
  }
  async getPostById(id: string): Promise<PostDto> {
    return await this.prisma.post.findUnique({
      where: { id },
    });
  }

  async deletePostById(id: string) {
    return await this.prisma.post.delete({
      where: { id },
    });
  }
}
