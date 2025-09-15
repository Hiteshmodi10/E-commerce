import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com' })
  email: string;

  @ApiProperty({ example: 'admin' })
  role: string;
}
