import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { FileUpload } from 'graphql-upload-ts';
import { CloudinaryService } from '../cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(input: CreateProductInput, image: FileUpload) {
    const { secure_url } = await this.cloudinaryService.uploadFile(image);
    input.image = secure_url;
    const product = this.productRepo.create({
      ...input,
      image: secure_url,
      category: { id: input.categoryId },
      vendor: { id: input.vendorId },
    });
    return await this.productRepo.save(product);
  }

  async getAll(): Promise<Product[]> {
    const products = await this.productRepo.find({ relations: ['category'] });
    if (!products.length) throw new NotFoundException('No Products');
    return products;
  }

  async getAllByCategory(category: string) {
    const products = await this.productRepo.find({
      where: {
        category: {
          name: category,
        },
      },
    });
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

  async update(
    input: UpdateProductInput,
    productId: string,
    image?: FileUpload,
  ): Promise<Product> {
    const existing = await this.getById(productId);
    if (!input && !image) throw new Error('You Can not Send Empty Data');
    if (image) {
      const { secure_url } = await this.cloudinaryService.uploadFile(image);
      input.image = secure_url;
    }
    const updated = this.productRepo.merge(existing, input);
    return await this.productRepo.save(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.productRepo.delete(id);
    return true;
  }
}
