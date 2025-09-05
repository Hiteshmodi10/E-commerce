// src/product/dto/create-product.dto.ts

import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

export class CreateProductDto {
  @ApiProperty({ example: 'Premium T-Shirt', description: 'The name of the product' })
  readonly name: string;

  @ApiProperty({ example: 'A high-quality cotton t-shirt', description: 'A detailed description of the product' })
  readonly description: string;

  @ApiProperty({ example: 29.99, description: 'The price of the product' })
  readonly price: number;

  @ApiProperty({ example: 'http://example.com/image.png', description: 'URL of the product image', required: false })
  readonly image: string;

  @ApiProperty({ example: 'Apparel', description: 'The category of the product' })
  readonly category: string;
}