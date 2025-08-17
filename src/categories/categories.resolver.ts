import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { Category } from './entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsAndCategories } from '../common/dataloader/products-category.loader';
import { BooleanResponse, CategoryListResponse, CategoryResponse } from '../common/responses/entities-responses.response';


@Resolver(() => Category)
export class CategoriesResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsAndCategories: ProductsAndCategories,
  ) {}

  // Create Category
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => CategoryResponse, { name: 'createCategory' })
  async createCategory(@Args('input') input: CreateCategoryInput) {
    return { data: await this.categoriesService.create(input) };
  }

  // Update Category
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => CategoryResponse, { name: 'updateCategory' })
  async updateCategory(
    @Args('input') input: UpdateCategoryInput,
    @Args('categoryId', { type: () => String })
    categoryId: string,
  ) {
    return { data: await this.categoriesService.update(input, categoryId) };
  }

  // Remove Category
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => BooleanResponse, { name: 'removeCategory' })
  async removeCategory(
    @Args('categoryId', { type: () => String })
    categoryId: string,
  ) {
    return { data: await this.categoriesService.remove(categoryId) };
  }

  // Get Categories
  @Query(() => CategoryListResponse, { name: 'getCategories' })
  async getCategories() {
    return { data: await this.categoriesService.findAll() };
  }

  // Get Category By Id
  @Query(() => CategoryResponse, { name: 'getCategory' })
  async getCategory(
    @Args('categoryId', { type: () => String })
    categoryId: string,
  ) {
    return { data: await this.categoriesService.findOne(categoryId) };
  }

  @ResolveField(() => [Product])
  async products(@Parent() category: Category) {
    return await this.productsAndCategories.categoryProducts.load(category.id);
  }
}
