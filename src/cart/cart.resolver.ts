import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CreateCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../assets/enum/role.enum';

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
}
