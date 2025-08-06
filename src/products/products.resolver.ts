import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { NotFoundException, UseGuards } from '@nestjs/common';
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
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { BaseResponse } from '../common/responses/base-response.object';
import { Product } from './entities/product.entity';

const ProductsResponse = BaseResponse(Product, true, 'ProductsList', false);
const ProductResponse = BaseResponse(Product, false, 'ProductItem');
const BooleanResponse = BaseResponse(Boolean, false, 'ProductBoolean');
const StringResponse = BaseResponse(String, false, 'ProductString');

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    @InjectQueue('products') private readonly pQueue: Queue,
  ) {}

  private pQueueEvents = new QueueEvents('products');

  private async readStreamToBuffer(
    stream: NodeJS.ReadableStream,
  ): Promise<Buffer> {
    const chunks: any[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  // Create Product
  @UseGuards(AuthGuard, RolesGuard, VendorIsApprovedGuard)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => String, { name: 'createProduct' })
  async createProduct(
    @Args('input') input: CreateProductInput,
    @CurrentUser() currentUser: Payload,
  ): Promise<string> {
    try {
      const buffer = await this.readStreamToBuffer(
        (await input.image).createReadStream(),
      );

      const job = await this.pQueue.add('upload-product-image', {
        file: {
          filename: (await input.image).filename,
          mimetype: (await input.image).mimetype,
          buffer: buffer.toString('base64'),
        },
        input,
        vendorId: currentUser.sub.vendorId,
      });

      await job.waitUntilFinished(this.pQueueEvents);

      return 'Product Creation is Done';
    } catch (error: any) {
      return `Error ${error.message}`;
    }
  }

  // Get All Products
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
  ) {
    let userId = '';
    currentUser ? (userId = currentUser.sub.userId) : null;
    const { products, counts } = await this.productsService.getAll(
      userId,
      take,
      skip,
      sortByFollowings,
      sortByPrice,
      sortByCreated,
    );
    return {
      data: products,
      pagination: {
        prev: skip,
        next: counts - 1 - skip,
        totalPages: Math.ceil(counts / take),
        currentPages: skip + 1,
      },
    };
  }

  // Get Products By Category
  @Query(() => ProductsResponse, { name: 'getProductsByCategory' })
  async productsByCategory(@Args('category') category: string) {
    return { data: await this.productsService.getAllByCategoryId(category) };
  }

  // Get Products By Vendor
  @Query(() => ProductsResponse, { name: 'getProductsByVendor' })
  async productsByVendor(@Args('vendorId') vendorId: string) {
    return { data: await this.productsService.getAllByVendor(vendorId) };
  }

  // Get Product By Id
  @UseGuards(CurrentProductGuard)
  @Query(() => ProductResponse, { name: 'getProductById' })
  async product(@Args('id') id: string) {
    return { data: await this.productsService.getById(id) };
  }

  // Update Product
  @UseGuards(
    AuthGuard,
    RolesGuard,
    VendorIsApprovedGuard,
    CurrentProductGuard,
    VendorOwnsProductGuard,
  )
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => StringResponse, { name: 'updateProduct' })
  async updateProduct(
    @Args('productId') productId: string,
    @Args('input') input: UpdateProductInput,
  ) {
    let fileData: any = null;

    if (input.image) {
      const file = await input.image;
      const buffer = await this.readStreamToBuffer(file.createReadStream());

      fileData = {
        buffer: buffer.toString('base64'),
        filename: file.filename,
        mimetype: file.mimetype,
      };
    }

    const job = await this.pQueue.add('update-product', {
      input: { ...input, image: undefined }, // remove image from input
      file: fileData,
      productId,
    });
    await job.waitUntilFinished(this.pQueueEvents);

    return { data: 'Product update is Done' };
  }

  // Delete Product
  @UseGuards(
    AuthGuard,
    RolesGuard,
    VendorIsApprovedGuard,
    CurrentProductGuard,
    VendorOwnsProductGuard,
  )
  @Roles(Role.SUPER_ADMIN, Role.VENDOR)
  @Mutation(() => BooleanResponse, { name: 'removeProduct' })
  async deleteProduct(@Args('productId') productId: string) {
    return { data: await this.productsService.delete(productId) };
  }

  @Query(() => String, { name: 'test' })
  async test() {
    await this.pQueue.add('test', {
      data: 'Test Data',
    });
    return 'Test Operation';
  }
}
