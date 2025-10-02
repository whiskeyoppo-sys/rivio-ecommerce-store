// Fully conceptualized - NestJS application bootstrap
// Design choice: Comprehensive setup with security, validation, and documentation

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);

  // Enable shutdown hooks for Prisma
  await prismaService.enableShutdownHooks(app);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Rivio E-Commerce API')
    .setDescription('API documentation for Rivio e-commerce platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('products', 'Product management')
    .addTag('orders', 'Order processing')
    .addTag('cart', 'Shopping cart')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('API_PORT', 3001);
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 API documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
