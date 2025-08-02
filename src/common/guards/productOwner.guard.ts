import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../common/enum/role.enum';
import { Product } from '../../products/entities/product.entity';

@Injectable()
export class VendorOwnsProductGuard implements CanActivate {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const productId = ctx.getArgs().productId;
    const req = ctx.getContext().req;
    const user = await req.user;
    const product = await this.productRepo.findOne({
      where: { id: productId, vendorId: user.sub.vendorId },
    });
    if (user.sub.role === Role.SUPER_ADMIN || product?.id) {
      return true;
    } else {
      throw new ForbiddenException('You do not own this product');
    }
  }
}
