import {
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { GqlExecutionContext } from '@nestjs/graphql';
import { log } from 'console';

export class CurrentProductGuard implements CanActivate {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const { id } = req.body.variables;
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('This Product is not Found.');
    return true;
  }
}
