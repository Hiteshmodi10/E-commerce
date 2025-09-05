// src/main.ts

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Import Swagger modules

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the Next client at http://localhost:3000 and allow credentials.
  // Using explicit origin (not '*') so cookies/credentials are allowed.
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Product API')
    .setDescription('A simple API to manage products')
    .setVersion('1.0')
    .addTag('products') // Add a tag for grouping your product endpoints
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Require bearer token globally in Swagger UI
  document.components = document.components || {};
  document.security = [{ 'access-token': [] }];
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  }); // Setup Swagger UI on the /api endpoint and enable persistent auth

  await app.listen(3001);
}
bootstrap();
