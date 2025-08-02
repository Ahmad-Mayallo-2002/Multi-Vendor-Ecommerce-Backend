import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { SortEnum } from '../common/enum/sort.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Payload } from '../common/types/payload.type';
import { VendorOwnsProductGuard } from '../common/guards/productOwner.guard';
import { CurrentProductGuard } from '../common/guards/currentProduct.guard';
import { VendorIsApprovedGuard } from '../common/guards/vendorIsApproved.guard';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard, RolesGuard, VendorIsApprovedGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => Product, { name: 'createProduct' })
  async createProduct(
    @Args('input') input: CreateProductInput,
    @CurrentUser() currentUser: Payload,
  ): Promise<Product> {
    const { sub } = currentUser;
    return this.productsService.createProduct(input, `${sub.vendorId}`);
  }

  @Query(() => [Product], { name: 'getProducts' })
  async products(
    @CurrentUser() currentUser: Payload,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByFollowings', {
      type: () => Boolean,
      defaultValue: false,
      nullable: true,
    })
    sortByFollowings: boolean,
    @Args('sortByPrice', { type: () => SortEnum, nullable: true })
    sortByPrice: SortEnum,
    @Args('sortByCreated', { type: () => SortEnum, nullable: true })
    sortByCreated: SortEnum,
  ): Promise<Product[]> {
    let userId = '';
    currentUser ? (userId = currentUser.sub.userId) : null;
    return this.productsService.getAll(
      userId,
      take,
      skip,
      sortByFollowings,
      sortByPrice,
      sortByCreated,
    );
  }

  @Query(() => [Product], { name: 'getProductsByCategory' })
  async productsByCategory(
    @Args('category') category: string,
  ): Promise<Product[]> {
    return this.productsService.getAllByCategoryId(category);
  }

  @Query(() => [Product], { name: 'getProductsByVendor' })
  async productsByVendor(
    @Args('vendorId') vendorId: string,
  ): Promise<Product[]> {
    return this.productsService.getAllByVendor(vendorId);
  }

  @UseGuards(CurrentProductGuard)
  @Query(() => Product, { name: 'getProductById' })
  async product(@Args('id') id: string): Promise<Product> {
    return this.productsService.getById(id);
  }

  @UseGuards(
    AuthGuard,
    RolesGuard,
    VendorIsApprovedGuard,
    CurrentProductGuard,
    VendorOwnsProductGuard,
  )
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => Product, { name: 'updateProduct' })
  async updateProduct(
    @Args('productId') productId: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.update(input, productId);
  }

  @UseGuards(
    AuthGuard,
    RolesGuard,
    VendorIsApprovedGuard,
    CurrentProductGuard,
    VendorOwnsProductGuard,
  )
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => Boolean, { name: 'removeProduct' })
  async deleteProduct(@Args('productId') productId: string): Promise<boolean> {
    return this.productsService.delete(productId);
  }
}
