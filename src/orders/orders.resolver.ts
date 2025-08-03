import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { RolesGuard } from '../common/guards/role.guard';
import { SortEnum } from '../common/enum/sort.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Payload } from '../common/types/payload.type';
import { Payment } from '../common/enum/payment-method.enum';
import { OrderExistPipes } from '../common/pipes/order-exist.pipe';
import { BooleanResponse } from '../common/responses/primitive-data-response.object';
import {
  OrdersResponse,
  OrderResponse,
} from '../common/responses/orders-response.object';
import { CreateOrderInput } from './dto/create-order.input';

@Resolver()
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => OrdersResponse, { name: 'getAllOrders' })
  async getAllOrders(
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByCreated', { type: () => SortEnum, nullable: true })
    sortByCreated: SortEnum,
  ): Promise<OrdersResponse> {
    return {
      data: await this.ordersService.getAllOrders(take, skip, sortByCreated),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => OrdersResponse, { name: 'getUserOrders' })
  async getUserOrders(
    @CurrentUser() currentUser: Payload,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByCreated', { type: () => SortEnum, nullable: true })
    sortByCreated: SortEnum,
  ): Promise<OrdersResponse> {
    const { sub } = currentUser;
    return {
      data: await this.ordersService.getUserOrders(
        sub.userId,
        take,
        skip,
        sortByCreated,
      ),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => OrderResponse, { name: 'getSingleOrder' })
  async getSingleOrder(
    @Args('orderId', { type: () => String }, OrderExistPipes) orderId: string,
  ): Promise<OrderResponse> {
    return { data: await this.ordersService.getSingleOrder(orderId) };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => BooleanResponse, { name: 'removeOrder' })
  async removeOrder(
    @Args('id', { type: () => String }) id: string,
  ): Promise<BooleanResponse> {
    return { data: await this.ordersService.removeOrder(id) };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => OrderResponse, { name: 'createOrder' })
  async createOrder(
    @Args("input") input: CreateOrderInput,
    @CurrentUser() currentUser: Payload,
  ) {
    return await this.ordersService.createOrder(
      input,
      currentUser.sub.userId,
    );
  }
}
