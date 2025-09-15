import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', required: false })
  @IsOptional()
  @IsString()
  otp?: string;
}
