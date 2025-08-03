import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { SortEnum } from '../common/enum/sort.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Payload } from '../common/types/payload.type';
import { BooleanResponse } from '../common/responses/primitive-data-response.object';
import {
  UserResponse,
  UsersResponse,
} from '../common/responses/users-response.object';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => UsersResponse, { name: 'getAllUsers' })
  async getAllUsers(
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByCreated', { type: () => SortEnum, nullable: true })
    sortByCreated: SortEnum,
  ): Promise<UsersResponse> {
    return {
      data: await this.usersService.getAllUsers(take, skip, sortByCreated),
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Query(() => UserResponse, { name: 'getUser' })
  async getUser(@CurrentUser() currentUser: Payload): Promise<UserResponse> {
    const { sub } = currentUser;
    return { data: await this.usersService.getUser(sub.userId) };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Mutation(() => BooleanResponse, { name: 'removeUser' })
  async removeUser(
    @CurrentUser() currentUser: Payload,
  ): Promise<BooleanResponse> {
    const { sub } = currentUser;
    return { data: await this.usersService.deleteUser(sub.userId) };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Mutation(() => BooleanResponse, { name: 'updateUser' })
  async updateUser(
    @CurrentUser() currentUser: Payload,
    @Args('input') input: UpdateUserInput,
  ): Promise<BooleanResponse> {
    const { sub } = currentUser;
    return { data: await this.usersService.updateUser(sub.userId, input) };
  }
}
