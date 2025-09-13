import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'https://your-site.com/reset', required: false })
  @IsOptional()
  @IsString()
  @IsUrl()
  redirectTo?: string;
}
