import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email of the user',
  })
  @IsString()
  email!: string;

  @ApiProperty({
    description: 'Username of the user',
  })
  @IsString()
  username!: string;

  @ApiProperty({
    description: 'Password of the user',
  })
  @IsString()
  password!: string;
}