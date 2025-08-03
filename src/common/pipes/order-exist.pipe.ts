import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Repository } from 'typeorm';
import { ExistsPipe } from './exists.pipe';

@Injectable()
export class OrderExistPipes extends ExistsPipe<Order> {
  constructor(@InjectRepository(Order) repo: Repository<Order>) {
    super(repo, 'Order');
  }
}
