import { ApiProperty } from '@nestjs/swagger';

export class ResendVerificationDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com' })
  email: string;

  @ApiProperty({ example: 'https://your-app.com/verify', required: false })
  redirectTo?: string;
}
