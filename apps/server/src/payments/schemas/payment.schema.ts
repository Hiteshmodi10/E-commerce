import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Payment extends Document {
  @ApiProperty({ description: 'ID of the order for which payment is made' })
  @Prop({ required: true })
  orderId: string;

  @ApiProperty({ description: 'Payment provider' })
  @Prop({ required: true })
  provider: string;

  @ApiProperty({ description: 'Amount paid' })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ description: 'Payment status' })
  @Prop({ required: true, default: 'pending' })
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
