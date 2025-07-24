import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CreateOrderInput } from './dto/create-order.input';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart) cartRepo: Repository<Cart>
  ) {}

  async getAllOrders(): Promise<Order[]> {
    const orders = await this.orderRepo.find();
    if (!orders.length) throw new NotFoundException('No Orders Here');
    return orders;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const orders = await this.orderRepo.find({ where: { userId } });
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
    const order =  this.orderRepo.create();
    return await this.orderRepo.save(order);
  }

  async removeOrder(id: string): Promise<boolean> {
    await this.getSingleOrder(id);
    await this.orderRepo.delete(id);
    return true;
  }
}
