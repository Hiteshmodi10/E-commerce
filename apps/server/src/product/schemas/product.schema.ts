import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
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

  @ApiProperty({ description: 'URL of the product image' })
  @Prop()
  image: string;

  @ApiProperty({ description: 'The category of the product' })
  @Prop({ required: true })
  category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);