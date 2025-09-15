// src/product/products.controller.ts

import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'; // Import Swagger decorators
import { Product } from './schemas/product.schema';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { Public } from '../auth/public.decorator';

@ApiTags('products') // Groups all endpoints under the "products" tag in Swagger
@Controller('api/products')
@UseGuards(SupabaseAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.', type: Product })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Returns all products.', type: [Product] })
  findAll() {
    return this.productsService.findAll();
  }

  @Get('low-stock')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get products with low stock' })
  @ApiQuery({ name: 'threshold', required: false, description: 'Stock threshold (default: 10)' })
  @ApiResponse({ status: 200, description: 'Returns products with low stock.', type: [Product] })
  getLowStockProducts(@Query('threshold') threshold?: string) {
    const thresholdNum = threshold ? parseInt(threshold) : 10;
    return this.productsService.getLowStockProducts(thresholdNum);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a product by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the product' })
  @ApiResponse({ status: 200, description: 'Returns the specified product.', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiParam({ name: 'id', description: 'The ID of the product to update' })
  @ApiResponse({ status: 200, description: 'The product has been successfully updated.', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  update(@Param('id') id: string, @Body() createProductDto: CreateProductDto) {
    return this.productsService.update(id, createProductDto);
  }

  @Patch(':id/stock')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update product stock quantity' })
  @ApiParam({ name: 'id', description: 'The ID of the product' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully.', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 400, description: 'Insufficient stock or invalid quantity.' })
  updateStock(@Param('id') id: string, @Body() body: { quantity: number }) {
    return this.productsService.updateStock(id, body.quantity);
  }

  @Get(':id/check-stock')
  @Public()
  @ApiOperation({ summary: 'Check if product has sufficient stock' })
  @ApiParam({ name: 'id', description: 'The ID of the product' })
  @ApiQuery({ name: 'quantity', description: 'Required quantity to check' })
  @ApiResponse({ status: 200, description: 'Returns stock availability.', schema: { type: 'object', properties: { available: { type: 'boolean' } } } })
  async checkStock(@Param('id') id: string, @Query('quantity') quantity: string) {
    const requiredQuantity = parseInt(quantity);
    const available = await this.productsService.checkStock(id, requiredQuantity);
    return { available };
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'The ID of the product to delete' })
  @ApiResponse({ status: 200, description: 'The product has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}