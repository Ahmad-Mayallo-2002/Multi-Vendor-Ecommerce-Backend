import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../assets/enum/role.enum';
import { RolesGuard } from '../auth/guards/role.guard';
import { SortEnum } from '../assets/enum/sort.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OrderAndPaymentClientSecret } from '../assets/objectTypes/orderAndPaymentClientSecret.type';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => [Order], { name: 'getAllOrders' })
  async getAllOrders(
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByCreated', { type: () => SortEnum, nullable: true })
    sortByCreated: SortEnum,
  ): Promise<Order[]> {
    return await this.ordersService.getAllOrders(take, skip, sortByCreated);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => [Order], { name: 'getUserOrders' })
  async getUserOrders(
    @CurrentUser() currentUser: Payload,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByCreated', { type: () => SortEnum, nullable: true })
    sortByCreated: SortEnum,
  ): Promise<Order[]> {
    const { sub } = await currentUser;
    return await this.ordersService.getUserOrders(
      sub.userId,
      take,
      skip,
      sortByCreated,
    );
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
  @Mutation(() => Boolean, { name: 'removeOrder' })
  async removeOrder(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return await this.ordersService.removeOrder(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => OrderAndPaymentClientSecret, { name: 'createOrder' })
  async createOrder(
    @Args('addressId', { type: () => String }) addressId: string,
    @CurrentUser() currentUser: Payload,
  ): Promise<OrderAndPaymentClientSecret> {
    const { sub } = await currentUser;
    return await this.ordersService.createOrder(addressId, sub.userId);
  }
}
