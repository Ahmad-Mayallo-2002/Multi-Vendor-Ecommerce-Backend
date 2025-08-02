import { Injectable } from '@nestjs/common';
import { ExistsPipe } from './exists.pipe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';

@Injectable()
export class CartExistPipes extends ExistsPipe<Cart> {
  constructor(@InjectRepository(Cart) repo: Repository<Cart>) {
    super(repo, 'Cart');
  }
}
