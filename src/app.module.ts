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
import { AddressesModule } from './addresses/addresses.module';
import { Address } from './addresses/entities/address.entity';
import { VendorsModule } from './vendors/vendors.module';
import { Vendor } from './vendors/entities/vendor.entity';
import { ErrorResponse } from './common/types/error.type';
import { PriceScalar } from './scalars/totalPrice.scalar';
import { PaymentMethod } from './orders/entities/payment-method.entity';
import { VendorReviewModule } from './vendor-review/vendor-review.module';
import { VendorReview } from './vendor-review/entities/vendor-review.entity';
import { ProductReviewModule } from './product-review/product-review.module';
import { ProductReview } from './product-review/entities/product-review.entity';
import { WebhookModule } from './webhook/webhook.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CacheModule } from '@nestjs/cache-manager';
import GraphQLJSON from 'graphql-type-json';
import { JwtService } from '@nestjs/jwt';
import { NotificaitonModule } from './notifications/notification.module';

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
      context: ({ req, res }) => ({ req, res }),
      resolvers: { JSON: GraphQLJSON },
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
        VendorReview,
        ProductReview,
      ],
    }),
    CacheModule.register({ isGlobal: true }),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    AuthModule,
    OrdersModule,
    FollowingModule,
    AddressesModule,
    VendorsModule,
    VendorReviewModule,
    ProductReviewModule,
    WebhookModule,
    CloudinaryModule,
    NotificaitonModule,
  ],
  controllers: [AppController],
  providers: [AppService, PriceScalar, JwtService],
})
export class AppModule {}
