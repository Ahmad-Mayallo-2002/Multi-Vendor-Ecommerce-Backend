import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Status } from '../assets/enum/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
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

  async updateOrderStatus(id: string, status: Status): Promise<boolean> {
    await this.getSingleOrder(id);
    await this.orderRepo.update(id, { status });
    return true;
  }

  async removeOrder(id: string): Promise<boolean> {
    await this.getSingleOrder(id);
    await this.orderRepo.delete(id);
    return true;
  }
}
