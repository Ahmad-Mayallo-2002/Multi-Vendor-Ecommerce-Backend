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
import { BaseResponse } from '../common/responses/base-response.object';
import { Cart } from './entities/cart.entity';

const CartListResponse = BaseResponse(Cart, true, 'CartList');
const CartResponse = BaseResponse(Cart, false, 'CartResponse');
const CartItemResponse = BaseResponse(CartItem, false, 'CartItemResponse');
const BooleanResponse = BaseResponse(Boolean, false, 'AddToItemResponse');

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  // Get All Carts
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => CartListResponse, { name: 'getAllCarts' })
  async getAllCarts() {
    return { data: await this.cartService.getAllCarts() };
  }

  // Get User Cart
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => CartResponse, { name: 'getUserCart' })
  async getUserCart(@CurrentUser() currentUser: Payload) {
    const { sub } = currentUser;
    return { data: await this.cartService.getUserCart(sub.userId) };
  }

  // Get Cart By Id
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => CartResponse, { name: 'getCart' })
  async getCart(
    @Args('id', { type: () => String }, CartExistPipes) id: string,
  ) {
    return { data: await this.cartService.getCart(id) };
  }

  // Add Item To Cart
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => CartItemResponse, { name: 'addItemToCart' })
  async addItemToCart(
    @Args('input') input: CreateCartItemInput,
    @CurrentUser() currentUser: Payload,
  ) {
    const { sub } = currentUser;
    return await this.cartService.addItemToCart(input, sub.userId);
  }

  // Remove Item From Cart
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => BooleanResponse, { name: 'removeItemFromCart' })
  async removeItemFromCart(@Args('itemId') itemId: string) {
    return { data: await this.cartService.removeItemFromCart(itemId) };
  }

  // Update Item in Current Cart
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => BooleanResponse, { name: 'updateItemCart' })
  async updateItemCart(
    @Args('itemId') itemId: string,
    @Args('input') input: UpdateCartItemInput,
  ) {
    return { data: await this.cartService.updateItemCart(itemId, input) };
  }
}
