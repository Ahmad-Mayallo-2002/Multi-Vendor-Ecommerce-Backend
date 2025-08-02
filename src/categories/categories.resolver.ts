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

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => Category, { name: 'createCategory' })
  async createCategory(@Args('input') input: CreateCategoryInput) {
    return await this.categoriesService.create(input);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => Category, { name: 'updateCategory' })
  async updateCategory(
    @Args('input') input: UpdateCategoryInput,
    @Args('categoryId', { type: () => String })
    categoryId: string,
  ): Promise<Category> {
    return await this.categoriesService.update(input, categoryId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => Boolean, { name: 'removeCategory' })
  async removeCategory(
    @Args('categoryId', { type: () => String })
    categoryId: string,
  ): Promise<Boolean> {
    return await this.categoriesService.remove(categoryId);
  }

  @Query(() => [Category], { name: 'getCategories' })
  async getCategories() {
    return await this.categoriesService.findAll();
  }

  @Query(() => Category, { name: 'getCategory' })
  async getCategory(
    @Args('categoryId', { type: () => String }, CategoryExistPipes)
    categoryId: string,
  ) {
    return await this.categoriesService.findOne(categoryId);
  }
}
