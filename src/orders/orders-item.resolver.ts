import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OrderItem } from './entities/order-item.entity';
import { OrdersAndItemsAndProducts } from '../common/dataloader/order-order-items-products.loader';

@Resolver(() => OrderItem)
export class OrderItemResolver {
  constructor(
    private readonly ordersAndItemsAndProducts: OrdersAndItemsAndProducts,
  ) {}

  @ResolveField(() => OrderItem)
  async product(@Parent() orderItem: OrderItem) {
    return this.ordersAndItemsAndProducts.productsInItems.load(
      orderItem.productId,
    );
  }
}
