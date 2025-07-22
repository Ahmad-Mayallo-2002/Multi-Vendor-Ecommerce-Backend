import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
  ) {}

  async getAllCarts(): Promise<Cart[]> {
    const carts = await this.cartRepo.find();
    if (!carts.length) throw new NotFoundException('No Carts are Found');
    return carts;
  }

  async getUserCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepo.findOne({ where: { userId } });
    if (!cart) throw new NotFoundException('This Cart is not Found');
    return cart;
  }

  async getCart(id: string): Promise<Cart> {
    const cart = await this.cartRepo.findOne({ where: { id } });
    if (!cart) throw new NotFoundException('This Cart is not Found');
    return cart;
  }

  async removeCart(userId: string): Promise<boolean> {
    await this.getUserCart(userId);
    await this.cartRepo.delete({userId});
    return true;
  }
}
