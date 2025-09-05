import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartsService {
	constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

	async create(createCartDto: CreateCartDto): Promise<Cart> {
		const newCart = new this.cartModel(createCartDto);
		return newCart.save();
	}

	async findAll(): Promise<Cart[]> {
		return this.cartModel.find().exec();
	}

	async findOne(id: string): Promise<Cart | null> {
		return this.cartModel.findById(id).exec();
	}

	async update(id: string, createCartDto: CreateCartDto): Promise<Cart | null> {
		return this.cartModel.findByIdAndUpdate(id, createCartDto, { new: true }).exec();
	}

	async remove(id: string): Promise<Cart | null> {
		return this.cartModel.findByIdAndDelete(id).exec();
	}
}
