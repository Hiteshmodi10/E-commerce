import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'userId123', description: 'ID of the user who placed the order' })
  readonly userId: string;

  @ApiProperty({ example: [{ productId: 'p1', quantity: 2 }], description: 'List of products in the order' })
  readonly items: Array<{ productId: string; quantity: number }>;

  @ApiProperty({ example: 59.98, description: 'Total amount for the order' })
  readonly total: number;

  @ApiProperty({ example: 'pending', description: 'Order status' })
  readonly status: string;
}
