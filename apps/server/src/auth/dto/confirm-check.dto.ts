import { ApiProperty } from '@nestjs/swagger';

export class ConfirmCheckDto {
  @ApiProperty({ example: 'supabase-user-id', required: false })
  supabaseId?: string;

  @ApiProperty({ example: 'hiteshmodi81287@gmail.com', required: false })
  email?: string;
}
