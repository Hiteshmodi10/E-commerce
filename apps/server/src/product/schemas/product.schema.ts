import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @ApiProperty({ description: 'The name of the product' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'A detailed description of the product' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'The price of the product' })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ description: 'The original price before discount', required: false })
  @Prop()
  originalPrice?: number;

  @ApiProperty({ description: 'URL of the product image' })
  @Prop()
  image: string;

  @ApiProperty({ description: 'The category of the product' })
  @Prop({ required: true })
  category: string;

  @ApiProperty({ description: 'The stock quantity available' })
  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @ApiProperty({ description: 'Product rating from 0 to 5', required: false })
  @Prop({ min: 0, max: 5 })
  rating?: number;

  @ApiProperty({ description: 'Date when the product was created' })
  createdAt?: Date;

  @ApiProperty({ description: 'Date when the product was last updated' })
  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);