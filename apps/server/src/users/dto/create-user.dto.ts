import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'hiteshmodi81287@gmail.com', description: 'User email' })
  readonly email: string;

  @ApiProperty({ example: 'securePassword', description: 'User password' })
  readonly password: string;

  @ApiProperty({ example: 'Hitesh Modi', description: 'Full name' })
  readonly name?: string;
}
