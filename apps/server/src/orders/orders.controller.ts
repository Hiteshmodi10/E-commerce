import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Order } from './schemas/order.schema';

@ApiTags('orders')
@ApiBearerAuth('access-token')
@Controller('api/orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new order' })
	@ApiResponse({ status: 201, description: 'The order has been successfully created.', type: Order })
	create(@Body() createOrderDto: CreateOrderDto) {
		return this.ordersService.create(createOrderDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all orders' })
	@ApiResponse({ status: 200, description: 'Returns all orders.', type: [Order] })
	findAll() {
		return this.ordersService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get an order by its ID' })
	@ApiParam({ name: 'id', description: 'The ID of the order' })
	@ApiResponse({ status: 200, description: 'Returns the specified order.', type: Order })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	findOne(@Param('id') id: string) {
		return this.ordersService.findOne(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update an existing order' })
	@ApiParam({ name: 'id', description: 'The ID of the order to update' })
	@ApiResponse({ status: 200, description: 'The order has been successfully updated.', type: Order })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	update(@Param('id') id: string, @Body() createOrderDto: CreateOrderDto) {
		return this.ordersService.update(id, createOrderDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete an order' })
	@ApiParam({ name: 'id', description: 'The ID of the order to delete' })
	@ApiResponse({ status: 200, description: 'The order has been successfully deleted.' })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	remove(@Param('id') id: string) {
		return this.ordersService.remove(id);
	}
}
