import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
	constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

	async create(createOrderDto: CreateOrderDto): Promise<Order> {
		const newOrder = new this.orderModel(createOrderDto);
		return newOrder.save();
	}

	async findAll(): Promise<Order[]> {
		return this.orderModel.find().exec();
	}

	async findOne(id: string): Promise<Order | null> {
		return this.orderModel.findById(id).exec();
	}

	async update(id: string, createOrderDto: CreateOrderDto): Promise<Order | null> {
		return this.orderModel.findByIdAndUpdate(id, createOrderDto, { new: true }).exec();
	}

	async remove(id: string): Promise<Order | null> {
		return this.orderModel.findByIdAndDelete(id).exec();
	}
}
