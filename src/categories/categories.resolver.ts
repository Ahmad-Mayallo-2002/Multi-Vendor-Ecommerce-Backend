import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { CategoryExistPipes } from './pipes/category-exist.pipe';
import { BooleanResponse } from '../common/responses/primitive-data-response.object';
import {
  CategoriesResponse,
  CategoryResponse,
} from '../common/responses/categories-response.object';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => CategoryResponse, { name: 'createCategory' })
  async createCategory(
    @Args('input') input: CreateCategoryInput,
  ): Promise<CategoryResponse> {
    return { data: await this.categoriesService.create(input) };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => CategoryResponse, { name: 'updateCategory' })
  async updateCategory(
    @Args('input') input: UpdateCategoryInput,
    @Args('categoryId', { type: () => String })
    categoryId: string,
  ): Promise<CategoryResponse> {
    return { data: await this.categoriesService.update(input, categoryId) };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => BooleanResponse, { name: 'removeCategory' })
  async removeCategory(
    @Args('categoryId', { type: () => String })
    categoryId: string,
  ): Promise<BooleanResponse> {
    return { data: await this.categoriesService.remove(categoryId) };
  }

  @Query(() => CategoriesResponse, { name: 'getCategories' })
  async getCategories(): Promise<CategoriesResponse> {
    return { data: await this.categoriesService.findAll() };
  }

  @Query(() => CategoryResponse, { name: 'getCategory' })
  async getCategory(
    @Args('categoryId', { type: () => String }, CategoryExistPipes)
    categoryId: string,
  ): Promise<CategoryResponse> {
    return { data: await this.categoriesService.findOne(categoryId) };
  }
}
