import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Validate price vs original price
    if (createProductDto.originalPrice && createProductDto.price > createProductDto.originalPrice) {
      throw new BadRequestException('Price cannot be higher than original price');
    }

    const newProduct = new this.productModel(createProductDto);
    const savedProduct = await newProduct.save();
    return this.transformProduct(savedProduct);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products.map(product => this.transformProduct(product));
  }

  async findOne(id: string): Promise<Product | null> {
    const product = await this.productModel.findById(id).exec();
    return product ? this.transformProduct(product) : null;
  }

  async update(id: string, updateProductDto: CreateProductDto): Promise<Product | null> {
    // Validate price vs original price
    if (updateProductDto.originalPrice && updateProductDto.price > updateProductDto.originalPrice) {
      throw new BadRequestException('Price cannot be higher than original price');
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    return updatedProduct ? this.transformProduct(updatedProduct) : null;
  }

  async remove(id: string): Promise<Product | null> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    return deletedProduct ? this.transformProduct(deletedProduct) : null;
  }

  async updateStock(id: string, quantity: number): Promise<Product | null> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock available');
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id, 
      { stock: newStock }, 
      { new: true }
    ).exec();
    
    return updatedProduct ? this.transformProduct(updatedProduct) : null;
  }

  async checkStock(id: string, requiredQuantity: number): Promise<boolean> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product.stock >= requiredQuantity;
  }

  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    const products = await this.productModel.find({ stock: { $lt: threshold } }).exec();
    return products.map(product => this.transformProduct(product));
  }

  private transformProduct(product: any): Product {
    const { _id, ...rest } = product.toObject();
    return { id: _id.toString(), ...rest };
  }
}