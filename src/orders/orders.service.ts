import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import Stripe from 'stripe';
import { SortEnum } from '../assets/enum/sort.enum';
import { PaymentMethod } from './entities/payment-method.entity';
import { Payment } from '../assets/enum/payment-method.enum';
import { OrderAndPaymentClientSecret } from '../assets/objectTypes/orderAndPaymentClientSecret.type';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,
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

  async createOrder(
    addressId: string,
    userId: string,
  ): Promise<OrderAndPaymentClientSecret> {
    const cart = await this.cartRepo.findOne({
      where: { userId },
      relations: ['cartItems', 'cartItems.product'],
    });
    if (!cart || !cart.cartItems.length)
      throw new BadRequestException('Cart is Empty');

    const newOrder = this.orderRepo.create({
      addressId,
      userId,
      totalPrice: cart.totalPrice,
    });

    const order = await this.orderRepo.save(newOrder);

    for (const item of cart.cartItems) {
      if (item.quantity > item.product.stock) throw new ConflictException()
      const orderItem = this.orderItemRepo.create({
        orderId: order.id,
        quantity: item.quantity,
        priceAtPayment: item.priceAtPayment,
        productId: item.productId,
      });
      await this.orderItemRepo.save(orderItem);
    }

    const paymentIntent = await this.createPaymentIntent(
      cart.totalPrice,
      'usd',
    );

    const newPayment = this.paymentMethodRepo.create({
      method: Payment.STRIPE,
      totalPrice: cart.totalPrice,
      orderId: order.id,
    });
    const payment = await this.paymentMethodRepo.save(newPayment);

    order.paymentId = payment.id;
    await this.orderRepo.save(order);

    return {
      order,
      clientSecret: paymentIntent.client_secret as string,
    };
  }

  async removeOrder(id: string): Promise<boolean> {
    await this.getSingleOrder(id);
    await this.orderRepo.delete(id);
    return true;
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
      relations: ['address', 'payment', 'orderItems', 'orderItems.product'],
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
}
