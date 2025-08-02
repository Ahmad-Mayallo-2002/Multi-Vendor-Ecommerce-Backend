import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExistsPipe } from '../../common/pipes/exists.pipe';

@Injectable()
export class CategoryExistPipes extends ExistsPipe<Category> {
  constructor(@InjectRepository(Category) repo: Repository<Category>) {
    super(repo, 'Category');
  }
}
