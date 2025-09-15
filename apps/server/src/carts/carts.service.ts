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
		const savedCart = await newCart.save();
		return this.transformCart(savedCart);
	}

	async findAll(): Promise<Cart[]> {
		const carts = await this.cartModel.find().exec();
		return carts.map(cart => this.transformCart(cart));
	}

	async findOne(id: string): Promise<Cart | null> {
		const cart = await this.cartModel.findById(id).exec();
		return cart ? this.transformCart(cart) : null;
	}

	async update(id: string, createCartDto: CreateCartDto): Promise<Cart | null> {
		const updatedCart = await this.cartModel.findByIdAndUpdate(id, createCartDto, { new: true }).exec();
		return updatedCart ? this.transformCart(updatedCart) : null;
	}

	async remove(id: string): Promise<Cart | null> {
		const deletedCart = await this.cartModel.findByIdAndDelete(id).exec();
		return deletedCart ? this.transformCart(deletedCart) : null;
	}

	private transformCart(cart: any): Cart {
		const { _id, ...rest } = cart.toObject();
		return { id: _id.toString(), ...rest };
	}
}
