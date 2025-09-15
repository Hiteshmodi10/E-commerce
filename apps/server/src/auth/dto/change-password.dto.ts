import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'supabase-user-id' })
  @IsString()
  supabaseId: string;

  @ApiProperty({ example: 'newSecurePassword' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
