import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @ApiProperty({ example: 'p1', description: 'Product ID' })
  @IsString()
  @IsNotEmpty()
  readonly productId: string;

  @ApiProperty({ example: 1, description: 'Quantity of the product' })
  @IsNotEmpty()
  readonly quantity: number;
}

export class CreateCartDto {
  @ApiProperty({ example: 'userId123', description: 'ID of the user who owns the cart' })
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @ApiProperty({ example: [{ productId: 'p1', quantity: 1 }], description: 'Products in the cart' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  readonly items: CartItemDto[];
}
