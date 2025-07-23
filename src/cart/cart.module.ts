import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { JwtService } from '@nestjs/jwt';
import { Product } from '../products/entities/product.entity';

@Module({
  providers: [CartResolver, CartService, JwtService],
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product])],
})
export class CartModule {}
