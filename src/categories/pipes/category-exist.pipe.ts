import { Injectable } from '@nestjs/common';
import { ExistsPipe } from '../../pipes/exists.pipe';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryExistPipes extends ExistsPipe<Category> {
  constructor(@InjectRepository(Category) repo: Repository<Category>) {
    super(repo, 'Category');
  }
}
