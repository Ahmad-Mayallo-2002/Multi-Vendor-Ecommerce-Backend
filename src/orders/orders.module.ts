import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { JwtService } from '@nestjs/jwt';
import { Cart } from '../cart/entities/cart.entity';
import { PaymentMethod } from './entities/payment-method.entity';

@Module({
  providers: [OrdersResolver, OrdersService, JwtService],
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Cart, PaymentMethod])],
})
export class OrdersModule {}
