import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { CartAndItemsAndProducts } from '../common/dataloader/cart-cart-items-products.loader';

@Resolver(() => CartItem)
export class CartItemResolver {
  constructor(private cartsAndItemsAndProducts: CartAndItemsAndProducts) {}

  @ResolveField(() => Product)
  async product(@Parent() cartItem: CartItem) {
    return this.cartsAndItemsAndProducts.productsInItems.load(
      cartItem.productId,
    );
  }
}
