import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Hitesh Modi', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'user', required: false, default: 'user' })
  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin'])
  role?: string;
}
