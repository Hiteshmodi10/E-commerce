import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword' })
  @IsString()
  @MinLength(6)
  password: string;
}
