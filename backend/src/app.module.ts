// Scaffolded - Root application module
// Design choice: Modular architecture with feature-based organization

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { PaymentsModule } from './payments/payments.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    
    // Core modules
    PrismaModule,
    RedisModule,
    
    // Feature modules
    AuthModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    PaymentsModule,
  ],
})
export class AppModule {}
