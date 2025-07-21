import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../assets/enum/role.enum';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { CurrentProductGuard } from './guards/currentProduct.guard';
import { ProductOwnerGuard } from './guards/productOwner.guard';
import { VendorIsApprovedGuard } from '../vendors/guards/vendorIsApproved.guard';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard, RolesGuard, VendorIsApprovedGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => Product, { name: 'createProduct' })
  async createProduct(
    @Args('input') input: CreateProductInput,
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
  ): Promise<Product> {
    return this.productsService.create(input, image);
  }

  @Query(() => [Product], { name: 'getProducts' })
  async products(): Promise<Product[]> {
    return this.productsService.getAll();
  }

  @Query(() => [Product], { name: 'getProductsByCategory' })
  async productsByCategory(
    @Args('category') category: string,
  ): Promise<Product[]> {
    return this.productsService.getAllByCategory(category);
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
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image?: FileUpload,
  ): Promise<Product> {
    return this.productsService.update(input, id, image);
  }

  @UseGuards(AuthGuard, RolesGuard, CurrentProductGuard, VendorIsApprovedGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => Boolean, { name: 'removeProduct' })
  async deleteProduct(@Args('id') id: string): Promise<boolean> {
    return this.productsService.delete(id);
  }
}
