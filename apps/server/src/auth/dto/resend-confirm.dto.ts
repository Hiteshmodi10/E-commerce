import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendConfirmDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com' })
  @IsEmail()
  email: string;
}
