import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UtilsService {
  constructor(private readonly prisma: PrismaService) { }

  async getUsername(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        isAdmin: true,
        rooms: {
          select: {
            id: true
          }
        }
      }
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      rooms: user.rooms,
    };
  }
}
