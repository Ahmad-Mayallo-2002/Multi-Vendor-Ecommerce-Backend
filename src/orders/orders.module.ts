import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { JwtService } from '@nestjs/jwt';
import { Cart } from '../cart/entities/cart.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { Product } from '../products/entities/product.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { OrderItemResolver } from './orders-item.resolver';
import { OrdersAndItemsAndProducts } from '../common/dataloader/order-order-items-products.loader';

@Module({
  providers: [
    OrdersResolver,
    OrdersService,
    JwtService,
    OrderItemResolver,
    OrdersAndItemsAndProducts,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Cart,
      PaymentMethod,
      Product,
      CartItem,
    ]),
  ],
})
export class OrdersModule {}
