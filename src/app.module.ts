import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { CartModule } from './cart/cart.module';
import { CartItem } from './cart/entities/cart-item.entity';
import { Cart } from './cart/entities/cart.entity';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { FollowingModule } from './following/following.module';
import { Following } from './following/entities/following.entity';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { PaymentMethod } from './payment-method/entities/payment-method.entity';
import { AddressesModule } from './addresses/addresses.module';
import { Address } from './addresses/entities/address.entity';
import { VendorsModule } from './vendors/vendors.module';
import { Vendor } from './vendors/entities/vendor.entity';
import { log } from 'console';
import { ErrorResponse } from './assets/types/error.type';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      sortSchema: true,
      autoSchemaFile: 'src/schema.gpl',
      formatError: (error) => {
        const originalError = error?.extensions?.originalError as ErrorResponse;
        return {
          message: originalError?.message || error.message,
          statusCode: originalError?.statusCode || 500,
          error: originalError?.error || 'Internal Server Error',
        };
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      autoLoadEntities: true,
      type: 'postgres',
      host: 'localhost',
      synchronize: true,
      entities: [
        User,
        Category,
        Product,
        CartItem,
        Cart,
        Address,
        Order,
        OrderItem,
        Following,
        PaymentMethod,
        Vendor,
      ],
    }),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    AuthModule,
    OrdersModule,
    FollowingModule,
    PaymentMethodModule,
    AddressesModule,
    VendorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
