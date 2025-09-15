import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

const Razorpay = require('razorpay');

@Injectable()
export class OrdersService {
	private razorpay: any;

	constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {
		this.razorpay = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_RGytIim6dBHnCa',
			key_secret: process.env.RAZORPAY_KEY_SECRET || 'DGhaXnz6RBtVT3Amj8qJ7HDg',
		});
	}

	async create(createOrderDto: CreateOrderDto): Promise<Order> {
		// Generate unique order number
		const orderNumber = this.generateOrderNumber();
		
		const orderData = {
			...createOrderDto,
			orderNumber,
			status: createOrderDto.status || 'pending',
			paymentStatus: createOrderDto.paymentStatus || (createOrderDto.paymentMethod === 'cod' ? 'pending' : 'pending'),
		};

		const newOrder = new this.orderModel(orderData);
		const savedOrder = await newOrder.save();
		return this.transformOrder(savedOrder);
	}

	private generateOrderNumber(): string {
		const prefix = 'ESH';
		const timestamp = Date.now().toString().slice(-8);
		const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
		return `${prefix}${timestamp}${random}`;
	}

	async placeOrder(createOrderDto: CreateOrderDto): Promise<Order> {
		try {
			// 1. Create the order
			const order = await this.create(createOrderDto);

			// 2. Reduce stock for each item
			await this.reduceProductStock(createOrderDto.items);

			// 3. Set estimated delivery date (7 days from now for COD, 3 days for online payment)
			const deliveryDays = createOrderDto.paymentMethod === 'cod' ? 7 : 3;
			const estimatedDelivery = new Date();
			estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);

			// 4. Update order with estimated delivery
			const updatedOrder = await this.orderModel.findByIdAndUpdate(
				order.id,
				{ estimatedDelivery },
				{ new: true }
			);

			return this.transformOrder(updatedOrder);
		} catch (error) {
			console.error('Error placing order:', error);
			throw new Error('Failed to place order');
		}
	}

	private async reduceProductStock(items: any[]): Promise<void> {
		// We need to import and inject the Products service here
		// For now, we'll make HTTP calls to the products API
		const productsBaseUrl = 'http://localhost:3001/api/products';
		
		for (const item of items) {
			try {
				// Get current product data
				const productResponse = await fetch(`${productsBaseUrl}/${item.productId}`);
				if (!productResponse.ok) {
					console.error(`Failed to fetch product ${item.productId}`);
					continue;
				}

				const product = await productResponse.json();
				const newStock = Math.max(0, product.stock - item.quantity);

				// Update product stock
				const updateResponse = await fetch(`${productsBaseUrl}/${item.productId}/stock`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ stock: newStock }),
				});

				if (!updateResponse.ok) {
					console.error(`Failed to update stock for product ${item.productId}`);
				}
			} catch (error) {
				console.error(`Error updating stock for product ${item.productId}:`, error);
			}
		}
	}

	async findByUserId(userId: string): Promise<Order[]> {
		const orders = await this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
		return orders.map(order => this.transformOrder(order));
	}

	async createRazorpayOrder(amount: number, currency: string = 'INR', receipt?: string): Promise<any> {
		try {
			const options = {
				amount: Math.round(amount * 100), // Convert to paise
				currency: currency,
				receipt: receipt || `receipt_${Date.now()}`,
				payment_capture: 1, // Auto capture payment
			};

			const order = await this.razorpay.orders.create(options);
			return order;
		} catch (error) {
			console.error('Error creating Razorpay order:', error);
			throw new Error('Failed to create payment order');
		}
	}

	async verifyRazorpayPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
		try {
			const crypto = require('crypto');
			const secret = process.env.RAZORPAY_KEY_SECRET || 'DGhaXnz6RBtVT3Amj8qJ7HDg';
			
			const expectedSignature = crypto
				.createHmac('sha256', secret)
				.update(orderId + '|' + paymentId)
				.digest('hex');

			return expectedSignature === signature;
		} catch (error) {
			console.error('Error verifying payment:', error);
			return false;
		}
	}

	async findAll(): Promise<Order[]> {
		const orders = await this.orderModel.find().exec();
		return orders.map(order => this.transformOrder(order));
	}

	async findOne(id: string): Promise<Order | null> {
		const order = await this.orderModel.findById(id).exec();
		return order ? this.transformOrder(order) : null;
	}

	async update(id: string, createOrderDto: CreateOrderDto): Promise<Order | null> {
		const updatedOrder = await this.orderModel.findByIdAndUpdate(id, createOrderDto, { new: true }).exec();
		return updatedOrder ? this.transformOrder(updatedOrder) : null;
	}

	async remove(id: string): Promise<Order | null> {
		const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
		return deletedOrder ? this.transformOrder(deletedOrder) : null;
	}

	private transformOrder(order: any): Order {
		const { _id, ...rest } = order.toObject();
		return { id: _id.toString(), ...rest };
	}
}
