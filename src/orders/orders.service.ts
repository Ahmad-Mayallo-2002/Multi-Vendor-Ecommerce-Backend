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
import { SortEnum } from '../common/enum/sort.enum';
import { PaymentMethod } from './entities/payment-method.entity';
import { Status } from '../common/enum/order-status.enum';
import { Product } from '../products/entities/product.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,
  ) {}

  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-06-30.basil',
  });

  // Stock Quantity in Product and ORder
  async createPaymentIntent(
    totalPrice: number,
    currency: string = 'usd',
    orderId: string,
  ) {
    return this.stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency,
      payment_method_types: ['card'],
      metadata: {
        orderId,
      },
    });
  }

  @Transactional()
  async createOrder(input: CreateOrderInput, userId: string) {
    const cart = await this.cartRepo.findOne({
      where: { userId },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart || !cart.cartItems.length)
      throw new BadRequestException('Cart is Empty');

    // Step 1: Create Order
    const newOrder = this.orderRepo.create({
      addressId: input.addressId,
      userId,
      totalPrice: cart.totalPrice,
    });

    const order = await this.orderRepo.save(this.orderRepo.create(newOrder));

    // Step 2: Create OrderItems
    for (const item of cart.cartItems) {
      if (item.quantity > item.product.stock)
        throw new ConflictException('Insufficient stock');

      const orderItem = this.orderItemRepo.create({
        orderId: order.id,
        quantity: item.quantity,
        priceAtPayment: item.priceAtPayment,
        productId: item.productId,
      });

      await this.orderItemRepo.save(orderItem);
    }

    // Step 3: Create PaymentIntent (outside the DB, won't rollback on failure)
    const paymentIntent = await this.createPaymentIntent(
      cart.totalPrice,
      'usd',
      order.id,
    );

    const brand = paymentIntent.payment_method_types;

    if (input.paymentMethod.toLowerCase() !== brand[0].toLowerCase())
      throw new BadRequestException('Card does not match selected method');

    // Step 4: Save Payment record
    const newPayment = this.paymentMethodRepo.create({
      method: input.paymentMethod,
      totalPrice: cart.totalPrice,
      orderId: order.id,
      paymentIntentId: paymentIntent.id,
    });

    const payment = await this.paymentMethodRepo.save(newPayment);

    // Step 5: Attach payment to order
    order.paymentId = payment.id;
    await this.orderRepo.save(order);

    return {
      order,
      clientSecret: paymentIntent.client_secret as string,
      paymentIntentId: paymentIntent.id,
    };
  }

  async markOrderAsPaid(paymentIntentId: string) {
    const payment = await this.paymentMethodRepo.findOne({
      where: { paymentIntentId },
      relations: ['order'],
    });

    if (!payment) throw new NotFoundException('PaymentIntent not found');

    const userId = payment.order.userId;

    const cart = await this.cartRepo.findOne({ where: { userId } });
    if (!cart) {
      await this.refundOrder(payment.paymentIntentId);
      throw new NotFoundException('Cart is not Found');
    }

    cart.totalPrice = 0;
    await this.cartRepo.save(cart);
    await this.cartItemRepo.delete({ cartId: cart.id });

    const order: Order = payment.order;
    payment.status = Status.PAID;

    const orderItems = await this.orderItemRepo.find({
      where: {
        orderId: order.id,
      },
      relations: ['product'],
    });

    for (const item of orderItems) {
      const product = item.product;
      if (!product) continue;
      if (product.stock < item.quantity) {
        await this.refundOrder(payment.paymentIntentId);
        throw new ConflictException('Insufficient stock');
      }
      product.stock -= item.quantity;
      await this.productRepo.save(product);
    }

    await this.paymentMethodRepo.save(payment);

    return true;
  }

  async markOrderAsFailed(paymentIntentId: string): Promise<string> {
    const paymentMethod = await this.paymentMethodRepo.findOne({
      where: { paymentIntentId },
    });
    if (!paymentMethod)
      throw new NotFoundException('No Payment found for this PaymentIntent');

    paymentMethod.status = Status.FAILED;
    await this.paymentMethodRepo.save(paymentMethod);

    return 'Order Payment is Failed';
  }

  async refundOrder(paymentIntentId: string): Promise<string> {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent)
      throw new NotFoundException('No charge found for this PaymentIntent');

    const payment = await this.paymentMethodRepo.findOne({
      where: { paymentIntentId },
    });
    if (!payment)
      throw new NotFoundException('No Payment for this PaymentIntent');

    const orderId = payment.orderId;

    await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer',
    });

    const items = await this.orderItemRepo.find({
      where: { orderId },
      relations: ['product'],
    });
    for (const item of items) {
      const product = item.product;
      if (!product) continue;
      product.stock += item.quantity;
      await this.productRepo.save(product);
    }

    payment.status = Status.REFUND;
    await this.paymentMethodRepo.save(payment);
    return 'Order is Refunded';
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
