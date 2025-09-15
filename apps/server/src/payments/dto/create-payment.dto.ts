import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 'orderId123', description: 'ID of the order for which payment is made' })
  readonly orderId: string;

  @ApiProperty({ example: 'stripe', description: 'Payment provider' })
  readonly provider: string;

  @ApiProperty({ example: 59.98, description: 'Amount paid' })
  readonly amount: number;

  @ApiProperty({ example: 'succeeded', description: 'Payment status' })
  readonly status: string;
}
