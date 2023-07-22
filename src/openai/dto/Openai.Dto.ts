import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class QuestionDto {
  @ApiProperty({
    description: 'Question',
  })
  @IsString()
  question!: string;
}