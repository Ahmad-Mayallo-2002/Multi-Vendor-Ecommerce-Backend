import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { CreateCartItemInput } from './dto/create-cart-item.input';
import { CartItem } from './entities/cart-item.entity';
import { UpdateCartItemInput } from './dto/update-cart-item.input';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Payload } from '../common/types/payload.type';
import { CartExistPipes } from '../common/pipes/cart-exist.pipe';
import { BooleanResponse } from '../common/responses/primitive-data-response.object';
import {
  CartResponse,
  CartsResponse,
} from '../common/responses/carts-response.object';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => CartsResponse, { name: 'getAllCarts' })
  async getAllCarts(): Promise<CartsResponse> {
    return { data: await this.cartService.getAllCarts() };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => CartResponse, { name: 'getUserCart' })
  async getUserCart(
    @CurrentUser() currentUser: Payload,
  ): Promise<CartResponse> {
    const { sub } = currentUser;
    return { data: await this.cartService.getUserCart(sub.userId) };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => CartResponse, { name: 'getCart' })
  async getCart(
    @Args('id', { type: () => String }, CartExistPipes) id: string,
  ): Promise<CartResponse> {
    return { data: await this.cartService.getCart(id) };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => CartItem, { name: 'addItemToCart' })
  async addItemToCart(
    @Args('input') input: CreateCartItemInput,
    @CurrentUser() currentUser: Payload,
  ): Promise<CartItem> {
    const { sub } = currentUser;
    return await this.cartService.addItemToCart(input, sub.userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => BooleanResponse, { name: 'removeItemFromCart' })
  async removeItemFromCart(
    @Args('itemId') itemId: string,
  ): Promise<BooleanResponse> {
    return { data: await this.cartService.removeItemFromCart(itemId) };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => BooleanResponse, { name: 'updateItemCart' })
  async updateItemCart(
    @Args('itemId') itemId: string,
    @Args('input') input: UpdateCartItemInput,
  ): Promise<BooleanResponse> {
    return { data: await this.cartService.updateItemCart(itemId, input) };
  }
}
