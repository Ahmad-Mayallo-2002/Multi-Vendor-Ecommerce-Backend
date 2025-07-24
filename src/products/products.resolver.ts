import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../assets/enum/role.enum';
import { CurrentProductGuard } from './guards/currentProduct.guard';
import { VendorIsApprovedGuard } from '../vendors/guards/vendorIsApproved.guard';
import { log } from 'console';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard, RolesGuard, VendorIsApprovedGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => Product, { name: 'createProduct' })
  async createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.createProduct(input);
  }

  @Query(() => [Product], { name: 'getProducts' })
  async products(): Promise<Product[]> {
    return this.productsService.getAll();
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

  @UseGuards(AuthGuard, RolesGuard, CurrentProductGuard, VendorIsApprovedGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => Product, { name: 'updateProduct' })
  async updateProduct(
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.update(input, id);
  }

  @UseGuards(AuthGuard, RolesGuard, CurrentProductGuard, VendorIsApprovedGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => Boolean, { name: 'removeProduct' })
  async deleteProduct(@Args('id') id: string): Promise<boolean> {
    return this.productsService.delete(id);
  }
}
