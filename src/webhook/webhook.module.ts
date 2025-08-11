import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from '../orders/entities/payment-method.entity';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';

@Module({
  controllers: [WebhookController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([
      PaymentMethod,
      Order,
      OrderItem,
      Product,
      Cart,
      CartItem,
    ]),
  ],
})
export class WebhookModule {}
