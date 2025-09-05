import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com' })
  email: string;

  @ApiProperty({ example: '123456', required: false })
  otp?: string;
}
