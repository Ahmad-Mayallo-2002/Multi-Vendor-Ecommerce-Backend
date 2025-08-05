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
import { OrderExistPipes } from '../common/pipes/order-exist.pipe';
import { CreateOrderInput } from './dto/create-order.input';
import { BaseResponse } from '../common/responses/base-response.object';
import { Order } from './entities/order.entity';

const OrderListResponse = BaseResponse(Order, true, 'OrderList');
const OrderResponse = BaseResponse(Order, false, 'OrderItemResponse');
const BooleanResponse = BaseResponse(Boolean, false, 'OrderBoolean');

@Resolver()
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  // Get All Orders
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => OrderListResponse, { name: 'getAllOrders' })
  async getAllOrders(
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByCreated', { type: () => SortEnum, nullable: true })
    sortByCreated: SortEnum,
  ) {
    return {
      data: await this.ordersService.getAllOrders(take, skip, sortByCreated),
    };
  }

  // Get User Orders
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => OrderListResponse, { name: 'getUserOrders' })
  async getUserOrders(
    @CurrentUser() currentUser: Payload,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByCreated', { type: () => SortEnum, nullable: true })
    sortByCreated: SortEnum,
  ) {
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

  // Get Order By Id
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Query(() => OrderResponse, { name: 'getSingleOrder' })
  async getSingleOrder(
    @Args('orderId', { type: () => String }, OrderExistPipes) orderId: string,
  ) {
    return { data: await this.ordersService.getSingleOrder(orderId) };
  }

  // Remove Order
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => BooleanResponse, { name: 'removeOrder' })
  async removeOrder(@Args('id', { type: () => String }) id: string) {
    return { data: await this.ordersService.removeOrder(id) };
  }

  // Create Order
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Mutation(() => OrderResponse, { name: 'createOrder' })
  async createOrder(
    @Args('input') input: CreateOrderInput,
    @CurrentUser() currentUser: Payload,
  ) {
    return await this.ordersService.createOrder(input, currentUser.sub.userId);
  }
}
