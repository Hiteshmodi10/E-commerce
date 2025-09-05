import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com' })
  email: string;

  @ApiProperty({ example: 'https://your-site.com/reset', required: false })
  redirectTo?: string;
}
