import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Injectable({ scope: Scope.REQUEST }) // request-scoped to avoid caching across requests
export class ProductsLoader {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  public readonly productsByVendor = new DataLoader<string, Product[]>(
    async (vendorIds: readonly string[]) => {
      // Fetch all products for the given vendor IDs in one query
      const products = await this.productRepo.find({
        where: { vendorId: In(vendorIds) },
      });

      // Group products by vendorId
      const productsMap = new Map<string, Product[]>();

      vendorIds.forEach((id) => productsMap.set(id, []));

      products.forEach((product) => {
        const vendorId = product.vendorId;
        productsMap.get(vendorId)?.push(product);
      });

      // Return products in the same order as vendorIds
      return vendorIds.map((id) => productsMap.get(id) || []);
    },
  );
}
