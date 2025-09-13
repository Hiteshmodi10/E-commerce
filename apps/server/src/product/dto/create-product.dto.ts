// src/product/dto/create-product.dto.ts

import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Premium T-Shirt', description: 'The name of the product' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'A high-quality cotton t-shirt', description: 'A detailed description of the product' })
  @IsString()
  readonly description: string;

  @ApiProperty({ example: 29.99, description: 'The price of the product' })
  @IsNumber()
  @Min(0)
  readonly price: number;

  @ApiProperty({ example: 39.99, description: 'The original price before discount', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly originalPrice?: number;

  @ApiProperty({ example: 'http://example.com/image.png', description: 'URL of the product image', required: false })
  @IsOptional()
  @IsString()
  readonly image?: string;

  @ApiProperty({ example: 'Apparel', description: 'The category of the product' })
  @IsString()
  readonly category: string;

  @ApiProperty({ example: 100, description: 'The stock quantity available' })
  @IsNumber()
  @Min(0)
  readonly stock: number;

  @ApiProperty({ example: 4.5, description: 'Product rating from 0 to 5', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  readonly rating?: number;
}