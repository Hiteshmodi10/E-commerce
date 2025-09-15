import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
  const newUser = new this.userModel(createUserDto);
  return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createFromSupabase(payload: { email: string; name?: string; supabaseId: string }): Promise<User> {
    const { email, name, supabaseId } = payload;
    // Avoid storing password when created via Supabase
    const newUser = new this.userModel({ email, name, supabaseId });
    return newUser.save();
  }
}
