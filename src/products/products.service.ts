import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { FileUpload } from 'graphql-upload-ts';
import { CloudinaryService } from '../cloudinary.service';
import { v2 } from 'cloudinary';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
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

  async getAll(): Promise<Product[]> {
    const products = await this.productRepo.find({ relations: ['category'] });
    if (!products.length) throw new NotFoundException('No Products');
    return products;
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
