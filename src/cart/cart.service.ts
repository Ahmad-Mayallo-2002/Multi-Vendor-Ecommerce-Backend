import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemInput } from './dto/create-cart-item.input';
import { Product } from '../products/entities/product.entity';
import { log } from 'console';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  private async getProduct(productId: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product is not Found');
    return product;
  }

  async getAllCarts(): Promise<Cart[]> {
    const carts = await this.cartRepo.find({
      relations: ['cartItems', 'cartItems.product', 'user'],
    });
    if (!carts.length) throw new NotFoundException('No Carts are Found');
    return carts;
  }

  async getUserCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepo.findOne({
      where: { userId },
      relations: ['cartItems', 'cartItems.product'],
    });
    if (!cart) throw new NotFoundException('This Cart is not Found');
    return cart;
  }

  async getCart(id: string): Promise<Cart> {
    const cart = await this.cartRepo.findOne({
      where: { id },
      relations: ['cartItems', 'cartItems.product'],
    });
    if (!cart) throw new NotFoundException('This Cart is not Found');
    return cart;
  }

  async removeCart(userId: string): Promise<boolean> {
    await this.getUserCart(userId);
    await this.cartRepo.delete({ userId });
    return true;
  }

  async addItemsToUserCart(input: CreateCartItemInput): Promise<Cart> {
    const product = await this.getProduct(input.productId);

    input.quantity = input.quantity || 1;
    if (product.stock < input.quantity)
      throw new BadRequestException('Insufficient stock');

    const priceAtPayment =
      input.quantity * product.price * (1 - product.discount / 100);

    let cart = await this.cartRepo.findOne({
      where: { userId: input.userId },
      relations: ['cartItems', 'cartItems.product'],
    });

    const newItem = this.cartItemRepo.create({ ...input, priceAtPayment });

    product.stock -= input.quantity;
    await this.productRepo.save(product);
    await this.cartItemRepo.save({
      ...newItem,
      cartId: cart?.id,
    });

    if (!cart) {
      cart = this.cartRepo.create({
        userId: input.userId,
        totalPrice: priceAtPayment,
        cartItems: [newItem],
      });
    } else {
      const index = cart.cartItems.findIndex(
        (item) => item.productId === input.productId,
      );
      if (index !== -1) {
        const existingItem = cart.cartItems[index];
        existingItem.quantity += input.quantity;
        existingItem.priceAtPayment =
          existingItem.quantity *
          (1 - existingItem.product.discount / 100) *
          existingItem.product.price;

        await this.cartItemRepo.save(existingItem);
      } else {
        await this.cartItemRepo.save({
          ...newItem,
          cartId: cart.id,
        });
        cart.cartItems.push(newItem);
      }
      cart.totalPrice = cart.cartItems.reduce(
        (sum, item) =>
          sum + item.quantity * product.price * (1 - product.discount / 100),
        0,
      );
    }

    return await this.cartRepo.save(cart);
  }

  async clearCart(cartId: string): Promise<Cart> {
    const cart = await this.getCart(cartId);
    if (!cart.cartItems.length) throw new BadRequestException('Cart is Empty');

    const cartItems = cart.cartItems;
    for (let i = 0; i < cartItems.length; i++) {
      const product = await this.getProduct(cartItems[i].productId);
      product.stock += cartItems[i].quantity;
      await this.productRepo.save(product);
    }
    cart.totalPrice = 0;
    cart.cartItems = [];
    return await this.cartRepo.save(cart);
  }

  async removeItemFromCart(
    cartId: string,
    productId: string,
  ): Promise<boolean> {
    const cart = await this.getCart(cartId);
    const product = await this.getProduct(productId);

    const item = await this.cartItemRepo.findOne({ where: { productId } });
    if (!item) throw new NotFoundException('Item is not Found');

    product.stock += item.quantity;
    cart.cartItems = cart.cartItems.filter(
      (item) => item.productId !== productId,
    );
    await this.productRepo.save(product);
    await this.cartItemRepo.delete({ productId });
    await this.cartRepo.save(cart);
    return true;
  }
}
