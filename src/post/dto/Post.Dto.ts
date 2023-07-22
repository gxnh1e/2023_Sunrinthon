import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostDto {
  @ApiProperty()
  @IsString()
  content!: string;
}
