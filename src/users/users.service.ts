import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { User } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        rooms: {
          select: {
            id: true,
            messages: {
              select: {
                id: true,
                content: true,
              }
            }
          }
        }
      }
    });
  }

  async createRoom(id: any): Promise<any> {
    const room = await this.prismaService.room.create({
      data: {
        users: {
          connect: {
            id: id,
          }
        }
      }
    });

    return room;
  }

  async openRoom(id: any): Promise<any> {
    const room = await this.prismaService.room.findUnique({
      where: {
        id: id,
      },
      include: {
        messages: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc',
          }
        },
        users: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        }
      }
    });

    return room;
  }

  async lastMessage(id: any): Promise<any> {
    const lastMessage = await this.prismaService.message.findFirst({
      where: {
        roomId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        content: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return lastMessage;
  }


  async createMessage(id: any, roomID: any, content: string): Promise<any> {
    console.log(id, roomID, content);
    const message = await this.prismaService.message.create({
      data: {
        content: content,
        user: {
          connect: {
            id: id,
          }
        },
        room: {
          connect: {
            id: roomID,
          }
        }
      }
    });

    return message;
  }
}
