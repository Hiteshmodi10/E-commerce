import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Cart } from './schemas/cart.schema';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@ApiTags('carts')
@Controller('api/carts')
@UseGuards(SupabaseAuthGuard)
export class CartsController {
	constructor(private readonly cartsService: CartsService) {}

	@Post()
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Create a new cart' })
	@ApiResponse({ status: 201, description: 'The cart has been successfully created.', type: Cart })
	create(@Body() createCartDto: CreateCartDto) {
		return this.cartsService.create(createCartDto);
	}

	@Get()
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Get all carts' })
	@ApiResponse({ status: 200, description: 'Returns all carts.', type: [Cart] })
	findAll() {
		return this.cartsService.findAll();
	}

	@Get(':id')
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Get a cart by its ID' })
	@ApiParam({ name: 'id', description: 'The ID of the cart' })
	@ApiResponse({ status: 200, description: 'Returns the specified cart.', type: Cart })
	@ApiResponse({ status: 404, description: 'Cart not found.' })
	findOne(@Param('id') id: string) {
		return this.cartsService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Update an existing cart' })
	@ApiParam({ name: 'id', description: 'The ID of the cart to update' })
	@ApiResponse({ status: 200, description: 'The cart has been successfully updated.', type: Cart })
	@ApiResponse({ status: 404, description: 'Cart not found.' })
	update(@Param('id') id: string, @Body() createCartDto: CreateCartDto) {
		return this.cartsService.update(id, createCartDto);
	}

	@Delete(':id')
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Delete a cart' })
	@ApiParam({ name: 'id', description: 'The ID of the cart to delete' })
	@ApiResponse({ status: 200, description: 'The cart has been successfully deleted.' })
	@ApiResponse({ status: 404, description: 'Cart not found.' })
	remove(@Param('id') id: string) {
		return this.cartsService.remove(id);
	}
}
