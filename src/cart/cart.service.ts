import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemInput } from './dto/create-cart-item.input';
import { Product } from '../products/entities/product.entity';
import { UpdateCartItemInput } from './dto/update-cart-item.input';
import { CartAndItemsAndProducts } from '../common/dataloader/cart-cart-items-products.loader';

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

  private async getCartItem(cartItemId: string): Promise<CartItem> {
    const item = await this.cartItemRepo.findOne({
      where: { id: cartItemId },
      relations: ['product'],
    });
    if (!item) throw new NotFoundException('This Item is not Found');
    return item;
  }

  async getAllCarts(): Promise<Cart[]> {
    const carts = await this.cartRepo.find({});
    if (!carts.length) throw new NotFoundException('No Carts are Found');
    return carts;
  }

  async getUserCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepo.findOne({
      where: { userId },
    });
    if (!cart) throw new NotFoundException('This Cart is not Found');
    return cart;
  }

  async getCart(id: string): Promise<Cart> {
    const cart = await this.cartRepo.findOne({
      where: { id },
    });
    if (!cart) throw new NotFoundException('This Cart is not Found');
    return cart;
  }

  async addItemToCart(
    input: CreateCartItemInput,
    userId: string,
  ): Promise<CartItem> {
    const product = await this.getProduct(input.productId);
    const cart = await this.getUserCart(userId);
    if (cart.userId !== userId) throw new Error('This is not Your Cart');
    const priceAtPayment =
      product.price * input.quantity * (1 - product.discount / 100);
    const currentItem = await this.cartItemRepo.findOne({
      where: { productId: input.productId },
    });

    // Validate Stock Product with Quantity
    if (product.stock < input.quantity)
      throw new Error('Stock is not Enough for Quantity');

    if (!currentItem) {
      const item = this.cartItemRepo.create({
        ...input,
        priceAtPayment,
        cartId: cart.id,
      });
      cart.totalPrice += priceAtPayment;
      await this.cartRepo.save(cart);
      return await this.cartItemRepo.save(item);
    } else {
      currentItem.priceAtPayment += priceAtPayment;
      currentItem.quantity += input.quantity;
      cart.totalPrice += priceAtPayment;
      await this.cartRepo.save(cart);
      return await this.cartItemRepo.save(currentItem);
    }
  }

  async removeItemFromCart(itemId: string, userId: string): Promise<boolean> {
    const item = await this.getCartItem(itemId);
    const { priceAtPayment, cartId } = item;
    await this.cartItemRepo.delete({ id: itemId });
    const cart = await this.getCart(cartId);
    if (cart.userId !== userId) throw new Error('This is not Your Cart');
    cart.totalPrice -= priceAtPayment;
    await this.cartRepo.save(cart);
    return true;
  }

  async updateItemCart(
    itemId: string,
    input: UpdateCartItemInput,
    userId: string,
  ): Promise<boolean> {
    const item = await this.getCartItem(itemId);
    const product = await this.getProduct(item.productId);

    const cart = await this.getCart(item.cartId);
    if (cart.userId !== userId) throw new Error('This is not Your Cart');

    if (product.stock < input.quantity)
      throw new BadRequestException('Quantity is Bigger than Stock');

    cart.totalPrice -= item.priceAtPayment;

    item.quantity = input.quantity;

    const priceAtPayment =
      item.product.price * input.quantity * (1 - item.product.discount / 100);

    item.priceAtPayment = priceAtPayment;

    await this.cartItemRepo.save(item);

    cart.totalPrice += priceAtPayment;

    await this.cartRepo.save(cart);
    return true;
  }
}
