import { Injectable } from '@nestjs/common';
import { ExistsPipe } from '../../pipes/exists.pipe';
import { Cart } from '../entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartExistPipes extends ExistsPipe<Cart> {
  constructor(@InjectRepository(Cart) repo: Repository<Cart>) {
    super(repo, 'Cart');
  }
}
