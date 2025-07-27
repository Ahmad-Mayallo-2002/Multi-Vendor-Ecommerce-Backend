import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../assets/enum/role.enum';
import { SortEnum } from '../assets/enum/sort.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Payload } from '../assets/types/payload.type';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => [User], { name: 'getAllUsers' })
  async getAllUsers(
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('sortByCreated', { type: () => SortEnum, nullable: true })
    sortByCreated: SortEnum,
  ): Promise<User[]> {
    return await this.usersService.getAllUsers(take, skip, sortByCreated);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Query(() => User, { name: 'getUser' })
  async getUser(@CurrentUser() currentUser: Payload): Promise<User> {
    const { sub } = currentUser;
    return await this.usersService.getUser(sub.userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Mutation(() => Boolean, { name: 'removeUser' })
  async removeUser(@CurrentUser() currentUser: Payload) {
    const { sub } = currentUser;
    return await this.usersService.deleteUser(sub.userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Mutation(() => Boolean, { name: 'updateUser' })
  async updateUser(
    @CurrentUser() currentUser: Payload,
    @Args('input') input: UpdateUserInput,
  ) {
    const { sub } = currentUser;
    return await this.usersService.updateUser(sub.userId, input);
  }
}
