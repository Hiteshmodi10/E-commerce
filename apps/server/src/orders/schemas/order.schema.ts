import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @ApiProperty({ description: 'ID of the user who placed the order' })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({ description: 'Items in the order' })
  @Prop({ type: Array, required: true })
  items: Array<{ productId: string; quantity: number }>;

  @ApiProperty({ description: 'Total amount for the order' })
  @Prop({ required: true })
  total: number;

  @ApiProperty({ description: 'Order status' })
  @Prop({ required: true, default: 'pending' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
