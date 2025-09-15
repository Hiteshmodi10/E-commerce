import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @ApiProperty({ description: 'ID of the user who placed the order' })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({ description: 'Order number for tracking' })
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @ApiProperty({ description: 'Items in the order' })
  @Prop({ type: Array, required: true })
  items: Array<{ 
    productId: string; 
    name: string;
    price: number;
    image: string;
    quantity: number 
  }>;

  @ApiProperty({ description: 'Total amount for the order' })
  @Prop({ required: true })
  total: number;

  @ApiProperty({ description: 'Order status' })
  @Prop({ 
    required: true, 
    default: 'pending',
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
  })
  status: string;

  @ApiProperty({ description: 'Payment method used' })
  @Prop({ required: true, enum: ['razorpay', 'cod'] })
  paymentMethod: string;

  @ApiProperty({ description: 'Payment status' })
  @Prop({ 
    required: true, 
    default: 'pending',
    enum: ['pending', 'completed', 'failed', 'refunded']
  })
  paymentStatus: string;

  @ApiProperty({ description: 'Razorpay payment ID if paid online' })
  @Prop({ required: false })
  paymentId?: string;

  @ApiProperty({ description: 'Shipping address' })
  @Prop({ type: Object, required: true })
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };

  @ApiProperty({ description: 'Tracking number for shipment' })
  @Prop({ required: false })
  trackingNumber?: string;

  @ApiProperty({ description: 'Estimated delivery date' })
  @Prop({ required: false })
  estimatedDelivery?: Date;

  @ApiProperty({ description: 'Additional notes or instructions' })
  @Prop({ required: false })
  notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
