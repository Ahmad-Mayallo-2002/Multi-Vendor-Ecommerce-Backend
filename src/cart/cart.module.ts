import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { JwtService } from '@nestjs/jwt';
import { Product } from '../products/entities/product.entity';
import { CartAndItemsAndProducts } from '../common/dataloader/cart-cart-items-products.loader';
import { CartItemResolver } from './cart-item.resolver';

@Module({
  providers: [
    CartResolver,
    CartService,
    JwtService,
    CartAndItemsAndProducts,
    CartItemResolver,
  ],
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product])],
})
export class CartModule {}
