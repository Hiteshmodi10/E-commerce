import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({ example: 'userId123', description: 'ID of the user who owns the cart' })
  readonly userId: string;

  @ApiProperty({ example: [{ productId: 'p1', quantity: 1 }], description: 'Products in the cart' })
  readonly items: Array<{ productId: string; quantity: number }>;
}
