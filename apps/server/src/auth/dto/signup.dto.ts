import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com' })
  email: string;

  @ApiProperty({ example: 'securePassword' })
  password: string;

  @ApiProperty({ example: 'Hitesh Modi', required: false })
  name?: string;
}
