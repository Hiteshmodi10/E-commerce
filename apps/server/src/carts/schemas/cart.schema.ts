import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Cart extends Document {
  @ApiProperty({ description: 'ID of the user who owns the cart' })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({ description: 'Products in the cart' })
  @Prop({ type: Array, required: true })
  items: Array<{ productId: string; quantity: number }>;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
