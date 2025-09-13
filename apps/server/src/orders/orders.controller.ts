import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Order } from './schemas/order.schema';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { Public } from '../auth/public.decorator';

@ApiTags('orders')
@Controller('api/orders')
@UseGuards(SupabaseAuthGuard)
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Post()
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Create a new order' })
	@ApiResponse({ status: 201, description: 'The order has been successfully created.', type: Order })
	create(@Body() createOrderDto: CreateOrderDto) {
		return this.ordersService.create(createOrderDto);
	}

	@Get()
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Get all orders' })
	@ApiResponse({ status: 200, description: 'Returns all orders.', type: [Order] })
	findAll() {
		return this.ordersService.findAll();
	}

	@Get(':id')
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Get an order by its ID' })
	@ApiParam({ name: 'id', description: 'The ID of the order' })
	@ApiResponse({ status: 200, description: 'Returns the specified order.', type: Order })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	findOne(@Param('id') id: string) {
		return this.ordersService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Update an existing order' })
	@ApiParam({ name: 'id', description: 'The ID of the order to update' })
	@ApiResponse({ status: 200, description: 'The order has been successfully updated.', type: Order })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	update(@Param('id') id: string, @Body() createOrderDto: CreateOrderDto) {
		return this.ordersService.update(id, createOrderDto);
	}

	@Delete(':id')
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Delete an order' })
	@ApiParam({ name: 'id', description: 'The ID of the order to delete' })
	@ApiResponse({ status: 200, description: 'The order has been successfully deleted.' })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	remove(@Param('id') id: string) {
		return this.ordersService.remove(id);
	}

	@Post('create-razorpay-order')
	@Public()
	@ApiOperation({ summary: 'Create a Razorpay order for payment' })
	@ApiResponse({ status: 201, description: 'Razorpay order created successfully.' })
	async createRazorpayOrder(@Body() orderData: { amount: number; currency?: string; receipt?: string }) {
		return this.ordersService.createRazorpayOrder(
			orderData.amount,
			orderData.currency || 'INR',
			orderData.receipt
		);
	}

	@Post('verify-payment')
	@Public()
	@ApiOperation({ summary: 'Verify Razorpay payment signature' })
	@ApiResponse({ status: 200, description: 'Payment verified successfully.' })
	async verifyPayment(@Body() paymentData: { paymentId: string; orderId: string; signature: string }) {
		const isValid = await this.ordersService.verifyRazorpayPayment(
			paymentData.paymentId,
			paymentData.orderId,
			paymentData.signature
		);
		return { verified: isValid };
	}

	@Post('place-order')
	@Public()
	@ApiOperation({ summary: 'Place a new order (handles stock reduction automatically)' })
	@ApiResponse({ status: 201, description: 'Order placed successfully.' })
	async placeOrder(@Body() createOrderDto: CreateOrderDto) {
		return this.ordersService.placeOrder(createOrderDto);
	}

	@Get('user/:userId')
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Get all orders for a specific user' })
	@ApiParam({ name: 'userId', description: 'The ID of the user' })
	@ApiResponse({ status: 200, description: 'Returns all orders for the user.', type: [Order] })
	async findByUserId(@Param('userId') userId: string) {
		return this.ordersService.findByUserId(userId);
	}
}
