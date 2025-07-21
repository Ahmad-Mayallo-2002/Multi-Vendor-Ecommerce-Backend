import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

export class ProductOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const { id } = req.body.variables;
    const {
      sub: { userId, role },
    } = await req.user;
    const product = await this.productRepo.findOne({where: {}})
    log(`User Id: ${userId}`);
    log(`Role: ${role}`);
    log(`Product Id: ${id}`);
    return true;
  }
}
