import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @ApiProperty({ description: 'User email' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: 'User password (hashed in production)' })
  @Prop()
  password?: string;

  @ApiProperty({ description: 'User full name' })
  @Prop()
  name: string;

  @ApiProperty({ description: 'Supabase user id' })
  @Prop({ unique: true, sparse: true })
  supabaseId?: string;

  @ApiProperty({ description: 'User role', example: 'user' })
  @Prop({ default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
