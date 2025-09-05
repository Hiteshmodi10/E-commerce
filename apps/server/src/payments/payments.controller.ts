import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Payment } from './schemas/payment.schema';

@ApiTags('payments')
@ApiBearerAuth('access-token')
@Controller('api/payments')
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentsService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new payment' })
	@ApiResponse({ status: 201, description: 'The payment has been successfully created.', type: Payment })
	create(@Body() createPaymentDto: CreatePaymentDto) {
		return this.paymentsService.create(createPaymentDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all payments' })
	@ApiResponse({ status: 200, description: 'Returns all payments.', type: [Payment] })
	findAll() {
		return this.paymentsService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a payment by its ID' })
	@ApiParam({ name: 'id', description: 'The ID of the payment' })
	@ApiResponse({ status: 200, description: 'Returns the specified payment.', type: Payment })
	@ApiResponse({ status: 404, description: 'Payment not found.' })
	findOne(@Param('id') id: string) {
		return this.paymentsService.findOne(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update an existing payment' })
	@ApiParam({ name: 'id', description: 'The ID of the payment to update' })
	@ApiResponse({ status: 200, description: 'The payment has been successfully updated.', type: Payment })
	@ApiResponse({ status: 404, description: 'Payment not found.' })
	update(@Param('id') id: string, @Body() createPaymentDto: CreatePaymentDto) {
		return this.paymentsService.update(id, createPaymentDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a payment' })
	@ApiParam({ name: 'id', description: 'The ID of the payment to delete' })
	@ApiResponse({ status: 200, description: 'The payment has been successfully deleted.' })
	@ApiResponse({ status: 404, description: 'Payment not found.' })
	remove(@Param('id') id: string) {
		return this.paymentsService.remove(id);
	}
}
