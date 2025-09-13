import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({ example: 'p1', description: 'Product ID' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 'Product Name', description: 'Product name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 29.99, description: 'Product price' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Product image URL' })
  @IsString()
  image: string;

  @ApiProperty({ example: 2, description: 'Quantity ordered' })
  @IsNumber()
  quantity: number;
}

class ShippingAddressDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '123 Main St', description: 'Street address' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Mumbai', description: 'City' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Maharashtra', description: 'State' })
  @IsString()
  state: string;

  @ApiProperty({ example: '400001', description: 'Postal code' })
  @IsString()
  postalCode: string;

  @ApiProperty({ example: 'India', description: 'Country' })
  @IsString()
  country: string;

  @ApiProperty({ example: '+91 9876543210', description: 'Phone number' })
  @IsString()
  phone: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'userId123', description: 'ID of the user who placed the order' })
  @IsString()
  readonly userId: string;

  @ApiProperty({ type: [OrderItemDto], description: 'List of products in the order' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  readonly items: OrderItemDto[];

  @ApiProperty({ example: 59.98, description: 'Total amount for the order' })
  @IsNumber()
  readonly total: number;

  @ApiProperty({ example: 'pending', description: 'Order status', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] })
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
  readonly status?: string;

  @ApiProperty({ example: 'razorpay', description: 'Payment method', enum: ['razorpay', 'cod'] })
  @IsEnum(['razorpay', 'cod'])
  readonly paymentMethod: string;

  @ApiProperty({ example: 'pending', description: 'Payment status', enum: ['pending', 'completed', 'failed', 'refunded'] })
  @IsOptional()
  @IsEnum(['pending', 'completed', 'failed', 'refunded'])
  readonly paymentStatus?: string;

  @ApiProperty({ example: 'pay_123456789', description: 'Payment ID from payment gateway', required: false })
  @IsOptional()
  @IsString()
  readonly paymentId?: string;

  @ApiProperty({ type: ShippingAddressDto, description: 'Shipping address' })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  readonly shippingAddress: ShippingAddressDto;

  @ApiProperty({ example: 'Please deliver after 6 PM', description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  readonly notes?: string;
}
