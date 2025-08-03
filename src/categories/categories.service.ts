import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { UpdateCategoryInput } from './dto/update-category.input';
import { CreateCategoryInput } from './dto/create-category.input';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(input: CreateCategoryInput): Promise<Category> {
    const category = this.categoryRepo.create({
      ...input,
      user: { id: input.user },
    });
    return await this.categoryRepo.save(category);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepo.find();
    if (!categories.length) throw new NotFoundException('No Categories Here');
    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Category is not found`);
    return category;
  }

  async update(input: UpdateCategoryInput, id: string): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, input);
    return this.categoryRepo.save(category);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    await this.categoryRepo.delete(id);
    return true;
  }
}
