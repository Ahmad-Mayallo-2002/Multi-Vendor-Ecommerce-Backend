import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../assets/enum/role.enum';
import { CreateCartItemInput } from './dto/create-cart-item.input';
import { CartItem } from './entities/cart-item.entity';
import { UpdateCartItemInput } from './dto/update-cart-item.input';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => [Cart], { name: 'getAllCarts' })
  async getAllCarts(): Promise<Cart[]> {
    return await this.cartService.getAllCarts();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => Cart, { name: 'getUserCart' })
  async getUserCart(@Context() context: any): Promise<Cart> {
    const { sub } = await context.req.user;
    return await this.cartService.getUserCart(sub.userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => Cart, { name: 'getCart' })
  async getCart(@Args('id', { type: () => String }) id: string): Promise<Cart> {
    return await this.cartService.getCart(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => CartItem, { name: 'addItemToCart' })
  async addItemToCart(
    @Context() context: any,
    @Args('input') input: CreateCartItemInput,
  ): Promise<CartItem> {
    const { sub } = await context.req.user;
    return await this.cartService.addItemToCart(input, sub.userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => Boolean, { name: 'removeItemFromCart' })
  async removeItemFromCart(@Args('itemId') itemId: string): Promise<boolean> {
    return await this.cartService.removeItemFromCart(itemId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => Boolean, { name: 'updateItemCart' })
  async updateItemCart(
    @Args('itemId') itemId: string,
    @Args('input') input: UpdateCartItemInput,
  ): Promise<boolean> {
    return await this.cartService.updateItemCart(itemId, input);
  }
}
