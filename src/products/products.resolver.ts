import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
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
import { BooleanResponse } from '../common/responses/primitive-data-response.object';
import {
  ProductResponse,
  ProductsResponse,
} from '../common/responses/products-response.object';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard, RolesGuard, VendorIsApprovedGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => ProductResponse, { name: 'createProduct' })
  async createProduct(
    @Args('input') input: CreateProductInput,
    @CurrentUser() currentUser: Payload,
  ): Promise<ProductResponse> {
    const { sub } = currentUser;
    return {
      data: await this.productsService.createProduct(input, `${sub.vendorId}`),
    };
  }

  @Query(() => ProductsResponse, { name: 'getProducts' })
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
  ): Promise<ProductsResponse> {
    let userId = '';
    currentUser ? (userId = currentUser.sub.userId) : null;
    return {
      data: await this.productsService.getAll(
        userId,
        take,
        skip,
        sortByFollowings,
        sortByPrice,
        sortByCreated,
      ),
    };
  }

  @Query(() => ProductsResponse, { name: 'getProductsByCategory' })
  async productsByCategory(
    @Args('category') category: string,
  ): Promise<ProductsResponse> {
    return { data: await this.productsService.getAllByCategoryId(category) };
  }

  @Query(() => ProductsResponse, { name: 'getProductsByVendor' })
  async productsByVendor(
    @Args('vendorId') vendorId: string,
  ): Promise<ProductsResponse> {
    return { data: await this.productsService.getAllByVendor(vendorId) };
  }

  @UseGuards(CurrentProductGuard)
  @Query(() => ProductResponse, { name: 'getProductById' })
  async product(@Args('id') id: string): Promise<ProductResponse> {
    return { data: await this.productsService.getById(id) };
  }

  @UseGuards(
    AuthGuard,
    RolesGuard,
    VendorIsApprovedGuard,
    CurrentProductGuard,
    VendorOwnsProductGuard,
  )
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => ProductResponse, { name: 'updateProduct' })
  async updateProduct(
    @Args('productId') productId: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductResponse> {
    return { data: await this.productsService.update(input, productId) };
  }

  @UseGuards(
    AuthGuard,
    RolesGuard,
    VendorIsApprovedGuard,
    CurrentProductGuard,
    VendorOwnsProductGuard,
  )
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => BooleanResponse, { name: 'removeProduct' })
  async deleteProduct(
    @Args('productId') productId: string,
  ): Promise<BooleanResponse> {
    return { data: await this.productsService.delete(productId) };
  }
}
