import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../assets/enum/role.enum';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => [User], { name: 'getAllUsers' })
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Query(() => User, { name: 'getUser' })
  async getUser(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<User> {
    return await this.usersService.getUser(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Mutation(() => Boolean, { name: 'removeUser' })
  async removeUser(@Args('userId', { type: () => String }) userId: string) {
    return await this.usersService.deleteUser(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Mutation(() => Boolean, { name: 'updateUser' })
  async updateUser(
    @Args('userId', { type: () => String }) userId: string,
    @Args('input') input: UpdateUserInput,
  ) {
    return await this.usersService.updateUser(userId, input);
  }
}
