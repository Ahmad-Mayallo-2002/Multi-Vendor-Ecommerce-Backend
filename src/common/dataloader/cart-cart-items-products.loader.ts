import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { Product } from '../../products/entities/product.entity';
import { In, Repository } from 'typeorm';
import DataLoader from 'dataloader';

@Injectable({ scope: Scope.REQUEST })
export class CartAndItemsAndProducts {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
  ) {}

  public readonly itemsInCarts = new DataLoader<string, CartItem[] | undefined>(
    async (cartIds: string[]) => {
      const items = await this.cartItemRepo.findBy({ cartId: In(cartIds) });
      const itemMap = new Map<string, CartItem[]>();

      cartIds.forEach((id) => itemMap.set(id, []));
      items.forEach((item) => itemMap.get(item.cartId)?.push(item));

      return cartIds.map((id) => itemMap.get(id) || []);
    },
  );

  public readonly productsInItems = new DataLoader<string, Product | undefined>(
    async (productIds: string[]) => {
      const products = await this.productRepo.findBy({ id: In(productIds) });

      const productMap = new Map(products.map((p) => [p.id, p]));
      return productIds.map((id) => productMap.get(id));
    },
  );
}
