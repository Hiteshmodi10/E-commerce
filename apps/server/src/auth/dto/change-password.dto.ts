import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'supabase-user-id' })
  supabaseId: string;

  @ApiProperty({ example: 'newSecurePassword' })
  newPassword: string;
}
