import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class ConfirmCheckDto {
  @ApiProperty({ example: 'supabase-user-id', required: false })
  @IsOptional()
  @IsString()
  supabaseId?: string;

  @ApiProperty({ example: 'hiteshmodi81287@gmail.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}
