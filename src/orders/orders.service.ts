import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CreateOrderInput } from './dto/create-order.input';
import Stripe from 'stripe';
import { SortEnum } from '../assets/enum/sort.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
  ) {}

  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-06-30.basil',
  });

  async createPaymentIntent(totalPrice: number, currency: string = 'usd') {
    return this.stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency,
      payment_method_types: ['card'],
    });
  }

  async getAllOrders(
    take: number,
    skip: number,
    sortByCreated: SortEnum,
  ): Promise<Order[]> {
    let order: Record<string, string> = {};
    if (sortByCreated) order.createdAt = sortByCreated;
    const orders = await this.orderRepo.find({ take, skip, order });
    if (!orders.length) throw new NotFoundException('No Orders Here');
    return orders;
  }

  async getUserOrders(
    userId: string,
    take: number,
    skip: number,
    sortByCreated: SortEnum,
  ): Promise<Order[]> {
    let order: Record<string, string> = {};
    if (sortByCreated) order.createdAt = sortByCreated;
    const orders = await this.orderRepo.find({
      where: { userId },
      take,
      skip,
      order,
    });
    if (!orders.length)
      throw new NotFoundException('This User do not have Orders');
    return orders;
  }

  async getSingleOrder(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('This Order is not Exist');
    return order;
  }

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const cart = await this.cartRepo.findOne({
      where: { userId: input.userId },
      relations: ['cartItems', 'cartItems.products'],
    });
    if (!cart || !cart.cartItems.length)
      throw new BadRequestException('Cart is Empty');

    const newOrder = this.orderRepo.create({
      ...input,
      totalPrice: cart.totalPrice,
    });
  }

  async removeOrder(id: string): Promise<boolean> {
    await this.getSingleOrder(id);
    await this.orderRepo.delete(id);
    return true;
  }
}
