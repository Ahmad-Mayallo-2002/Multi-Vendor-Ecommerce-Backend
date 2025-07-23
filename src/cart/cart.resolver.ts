import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../assets/enum/role.enum';
import { CreateCartItemInput } from './dto/create-cart-item.input';

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
  async getUserCart(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<Cart> {
    return await this.cartService.getUserCart(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => Cart, { name: 'getCart' })
  async getCart(@Args('id', { type: () => String }) id: string): Promise<Cart> {
    return await this.cartService.getCart(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => Boolean, { name: 'removeCart' })
  async removeCart(@Args('userId', { type: () => String }) userId: string) {
    return await this.cartService.removeCart(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => Cart, { name: 'addItemsToCart' })
  async addItemsToCart(@Args('input') input: CreateCartItemInput) {
    return await this.cartService.addItemsToUserCart(input);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => Cart, { name: 'clearCart' })
  async clearCart(@Args('cartId', { type: () => String }) cartId: string) {
    return await this.cartService.clearCart(cartId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => Boolean, { name: 'removeItemFromCart' })
  async removeItemFromCart(
    @Args('cartId', { type: () => String }) cartId: string,
    @Args('productId', { type: () => String }) productId: string,
  ) {
    return await this.cartService.removeItemFromCart(cartId, productId);
  }
}
