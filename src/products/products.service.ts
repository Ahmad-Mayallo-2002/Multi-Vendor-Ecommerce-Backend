import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary.service';
import { v2 } from 'cloudinary';
import { log } from 'console';
import { Following } from '../following/entities/following.entity';
import { SortEnum } from '../assets/enum/sort.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Following)
    private readonly followingsRepo: Repository<Following>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createProduct(input: CreateProductInput) {
    const { secure_url, public_id } = await this.cloudinaryService.uploadFile(
      await input.image,
    );
    const product = this.productRepo.create({
      ...input,
      image: secure_url,
      public_id,
    });
    return await this.productRepo.save(product);
  }

  async getAll(
    userId: string,
    take: number,
    skip: number,
    sortByFollowings: boolean,
    sortByPrice: SortEnum,
    sortByCreated: SortEnum,
  ): Promise<Product[]> {
    const userFollowings = await this.followingsRepo.find({
      where: { userId },
    });

    const followedVendorIds = new Set(userFollowings.map((v) => v.vendorId));

    let orderBy: Record<string, string> = {};

    if (sortByPrice) orderBy.price = sortByPrice;
    if (sortByCreated) orderBy.createdAt = sortByCreated;

    const allProducts = await this.productRepo.find({
      take,
      skip,
      order: orderBy,
    });

    if (!allProducts.length) throw new NotFoundException('No Products');

    if (sortByFollowings) {
      log(sortByFollowings);
      const followedProducts: Product[] = [];
      const otherProducts: Product[] = [];
      for (const product of allProducts)
        followedVendorIds.has(product.vendorId)
          ? followedProducts.push(product)
          : otherProducts.push(product);
      return [...followedProducts, ...otherProducts];
    }
    return allProducts;
  }

  async getAllByCategoryId(categoryId: string) {
    const products = await this.productRepo.find({ where: { categoryId } });
    if (!products.length)
      throw new NotFoundException('No Products from this Category');
    return products;
  }

  async getAllByVendor(vendorId: string) {
    const products = await this.productRepo.find({
      where: { vendor: { id: vendorId } },
    });
    if (!products.length)
      throw new NotFoundException('No Products from this Vendor');
    return products;
  }

  async getById(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product is not found`);
    return product;
  }

  async update(input: UpdateProductInput, productId: string): Promise<Product> {
    const existing = await this.getById(productId);
    if (!input) throw new Error('You Can not Send Empty Data');
    if (input.image) {
      v2.api.delete_resources([existing.public_id]);
      const { secure_url, public_id } = await this.cloudinaryService.uploadFile(
        await input.image,
      );
      input.image = secure_url;
      existing.public_id = public_id;
    }
    const updated = this.productRepo.merge(existing, input.data);
    return await this.productRepo.save(updated);
  }

  async delete(id: string): Promise<boolean> {
    const product = await this.getById(id);
    await this.productRepo.delete(id);
    v2.api.delete_resources([product.public_id]);
    return true;
  }
}
