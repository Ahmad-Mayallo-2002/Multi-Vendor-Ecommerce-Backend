import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../products/entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import DataLoader from 'dataloader';

@Injectable({ scope: Scope.REQUEST })
export class ProductsAndCategories {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  // Get Product With Its Category
  public readonly productsCategory = new DataLoader<
    string,
    Category | undefined
  >(async (categoryIds: string[]) => {
    const categories = await this.categoryRepo.findByIds(categoryIds);

    // Map the found categories back to the given IDs in correct order
    const categoryMap = new Map(categories.map((c) => [c.id, c]));
    return categoryIds.map((id) => categoryMap.get(id));
  });

  // Get Category With Their Products
  public readonly categoryProducts = new DataLoader<string, Product[]>(
    async (categoryIds: string[]) => {
      // Fetch all products for these category IDs
      const products = await this.productRepo.find({
        where: { categoryId: In(categoryIds) },
      });

      // Group products by categoryId
      const productMap = new Map<string, Product[]>();
      for (const product of products) {
        if (!productMap.has(product.categoryId))
          productMap.set(product.categoryId, []);
        productMap.get(product.categoryId)!.push(product);
      }

      // Return in the same order as the keys passed to DataLoader
      return categoryIds.map((id) => productMap.get(id) || []);
    },
  );

}
