import { ApiProperty } from '@nestjs/swagger';

export class ResendConfirmDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com' })
  email: string;
}
