import { Injectable } from '@nestjs/common';
import { ExistsPipe } from '../../pipes/exists.pipe';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderExistPipes extends ExistsPipe<Order> {
  constructor(@InjectRepository(Order) repo: Repository<Order>) {
    super(repo, 'Order');
  }
}
