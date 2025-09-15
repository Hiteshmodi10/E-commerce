import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // This line connects your entire application to your MongoDB database.
    // It looks for a database named 'ecommerce-store' on your local machine.
    MongooseModule.forRoot('mongodb+srv://hiteshmodi81287:hpmodi@cluster0.tgm65hf.mongodb.net/ecommerce-store?retryWrites=true&w=majority'),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}