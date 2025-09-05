import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
	constructor(@InjectModel(Payment.name) private paymentModel: Model<Payment>) {}

	async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
		const newPayment = new this.paymentModel(createPaymentDto);
		return newPayment.save();
	}

	async findAll(): Promise<Payment[]> {
		return this.paymentModel.find().exec();
	}

	async findOne(id: string): Promise<Payment | null> {
		return this.paymentModel.findById(id).exec();
	}

	async update(id: string, createPaymentDto: CreatePaymentDto): Promise<Payment | null> {
		return this.paymentModel.findByIdAndUpdate(id, createPaymentDto, { new: true }).exec();
	}

	async remove(id: string): Promise<Payment | null> {
		return this.paymentModel.findByIdAndDelete(id).exec();
	}
}
