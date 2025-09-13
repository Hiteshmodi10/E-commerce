import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ResendVerificationDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'https://your-app.com/verify', required: false })
  @IsOptional()
  @IsString()
  redirectTo?: string;
}
