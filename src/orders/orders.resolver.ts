import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Status } from '../assets/enum/order-status.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../assets/enum/role.enum';
import { RolesGuard } from '../auth/guards/role.guard';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => [Order], { name: 'getAllOrders' })
  async getAllOrders(): Promise<Order[]> {
    return await this.ordersService.getAllOrders();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => [Order], { name: 'getUserOrders' })
  async getUserOrders(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<Order[]> {
    return await this.ordersService.getUserOrders(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => Order, { name: 'getSingleOrder' })
  async getSingleOrder(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Order> {
    return await this.ordersService.getSingleOrder(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => Boolean, { name: 'updateOrderStatus' })
  async updateOrderStatus(
    @Args('id', { type: () => String }) id: string,
    @Args('status', { type: () => Status }) status: Status,
  ): Promise<boolean> {
    return await this.ordersService.updateOrderStatus(id, status);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => Boolean, { name: 'removeOrder' })
  async removeOrder(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return await this.ordersService.removeOrder(id);
  }
}
