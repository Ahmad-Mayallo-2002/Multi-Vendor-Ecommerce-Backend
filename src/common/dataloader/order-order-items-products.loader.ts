import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DataLoader from 'dataloader';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Product } from '../../products/entities/product.entity';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class OrdersAndItemsAndProducts {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  public readonly itemsInOrder = new DataLoader<
    string,
    OrderItem[] | undefined
  >(async (orderIds: string[]) => {
    const items = await this.orderItemRepo.findBy({ orderId: In(orderIds) });
    const itemMap = new Map<string, OrderItem[]>();

    orderIds.forEach((id) => itemMap.set(id, []));
    items.forEach((item) => itemMap.get(item.orderId)?.push(item));

    return orderIds.map((id) => itemMap.get(id) || []);
  });

  public readonly productsInItems = new DataLoader<string, Product | undefined>(
    async (productIds: string[]) => {
      const products = await this.productRepo.findBy({ id: In(productIds) });

      const productMap = new Map(products.map((p) => [p.id, p]));
      return productIds.map((id) => productMap.get(id));
    },
  );
}
