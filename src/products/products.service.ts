import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { v2 } from 'cloudinary';
import { Following } from '../following/entities/following.entity';
import { SortEnum } from '../common/enum/sort.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Following)
    private readonly followingsRepo: Repository<Following>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createProduct(input: CreateProductInput, vendorId: string) {
    const image = await this.cloudinaryService.uploadFile(await input.image);
    const newProduct = this.productRepo.create({
      ...input,
      image: image.secure_url,
      public_id: image.public_id,
      vendorId,
    });
    return await this.productRepo.save(newProduct);
  }

  async getAll(
    userId: string,
    take: number,
    page: number,
    sortByFollowings: boolean,
    sortByPrice: SortEnum,
    sortByCreated: SortEnum,
  ) {
    const counts = await this.productRepo.count({});
    if (page > Math.ceil(counts / take))
      throw new NotFoundException('No Products');
    if (!userId)
      return {
        products: await this.productRepo.find({
          take,
          skip: (page - 1) * take,
        }),
        counts,
      };
    const userFollowings = await this.followingsRepo.find({
      where: { userId },
      select: ['vendorId'],
    });

    const followedVendorIds = new Set(userFollowings as any);

    let orderBy: Record<string, string> = {};

    if (sortByPrice) orderBy.price = sortByPrice;
    if (sortByCreated) orderBy.createdAt = sortByCreated;

    const allProducts = await this.productRepo.find({
      take,
      skip: (page - 1) * take,
      order: orderBy,
    });

    if (!allProducts.length) throw new NotFoundException('No Products');

    if (sortByFollowings) {
      const followedProducts: Product[] = [];
      const otherProducts: Product[] = [];
      for (const product of allProducts)
        followedVendorIds.has(product.vendorId)
          ? followedProducts.push(product)
          : otherProducts.push(product);
      return {
        products: [...followedProducts, ...otherProducts],
        counts,
      };
    }
    return {
      products: allProducts,
      counts,
    };
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
    return (await this.productRepo.findOne({
      where: { id },
    })) as Product;
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
    v2.api.delete_all_resources([product.public_id]);
    await this.productRepo.delete(id);
    return true;
  }
}
