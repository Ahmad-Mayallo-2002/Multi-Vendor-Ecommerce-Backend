import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { RolesGuard } from '../common/guards/role.guard';
import { SortEnum } from '../common/enum/sort.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OrderResponse } from '../common/objectTypes/orderResponse.type';
import { Payload } from '../common/types/payload.type';
import { Payment } from '../common/enum/payment-method.enum';
import { OrderExistPipes } from '../common/order-exist.pipe';

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
    const { sub } = currentUser;
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
    @Args('orderId', { type: () => String }, OrderExistPipes) orderId: string,
  ): Promise<Order> {
    return await this.ordersService.getSingleOrder(orderId);
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
  @Mutation(() => OrderResponse, { name: 'createOrder' })
  async createOrder(
    @Args('addressId', { type: () => String }) addressId: string,
    @Args('paymentMethod', { type: () => Payment }) paymentMethod: Payment,
    @CurrentUser() currentUser: Payload,
  ): Promise<OrderResponse> {
    const { sub } = currentUser;
    return await this.ordersService.createOrder(
      addressId,
      sub.userId,
      paymentMethod,
    );
  }
}
