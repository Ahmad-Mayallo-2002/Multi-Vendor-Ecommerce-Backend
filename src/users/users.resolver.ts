import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enum/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Payload } from '../common/types/payload.type';
import { BaseResponse } from '../common/responses/base-response.object';
import { User } from './entities/user.entity';

const UsersResponse = BaseResponse(User, true, 'UserList');
const UserResponse = BaseResponse(User, false, 'UserItem');
const BooleanResponse = BaseResponse(Boolean, false, 'UserBoolean');

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // Get All Users
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => UsersResponse, { name: 'getAllUsers' })
  async getAllUsers() {
    return {
      data: await this.usersService.getAllUsers(),
    };
  }

  // Get User By Id
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Query(() => UserResponse, { name: 'getUser' })
  async getUser(@CurrentUser() currentUser: Payload) {
    const { sub } = currentUser;
    return { data: await this.usersService.getUser(sub.userId) };
  }

  // Remove User
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Mutation(() => BooleanResponse, { name: 'removeUser' })
  async removeUser(@CurrentUser() currentUser: Payload) {
    const { sub } = currentUser;
    return { data: await this.usersService.deleteUser(sub.userId) };
  }

  // Update User
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Mutation(() => BooleanResponse, { name: 'updateUser' })
  async updateUser(
    @CurrentUser() currentUser: Payload,
    @Args('input') input: UpdateUserInput,
  ) {
    const { sub } = currentUser;
    return { data: await this.usersService.updateUser(sub.userId, input) };
  }
}
