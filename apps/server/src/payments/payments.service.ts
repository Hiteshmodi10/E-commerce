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
		const savedPayment = await newPayment.save();
		return this.transformPayment(savedPayment);
	}

	async findAll(): Promise<Payment[]> {
		const payments = await this.paymentModel.find().exec();
		return payments.map(payment => this.transformPayment(payment));
	}

	async findOne(id: string): Promise<Payment | null> {
		const payment = await this.paymentModel.findById(id).exec();
		return payment ? this.transformPayment(payment) : null;
	}

	async update(id: string, createPaymentDto: CreatePaymentDto): Promise<Payment | null> {
		const updatedPayment = await this.paymentModel.findByIdAndUpdate(id, createPaymentDto, { new: true }).exec();
		return updatedPayment ? this.transformPayment(updatedPayment) : null;
	}

	async remove(id: string): Promise<Payment | null> {
		const deletedPayment = await this.paymentModel.findByIdAndDelete(id).exec();
		return deletedPayment ? this.transformPayment(deletedPayment) : null;
	}

	private transformPayment(payment: any): Payment {
		const { _id, ...rest } = payment.toObject();
		return { id: _id.toString(), ...rest };
	}
}
