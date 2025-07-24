import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
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
  async getUser(@Context() context: any): Promise<User> {
    const { sub } = await context.req.user;
    return await this.usersService.getUser(sub.userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Mutation(() => Boolean, { name: 'removeUser' })
  async removeUser(@Context() context: any) {
    const { sub } = await context.req.user;
    return await this.usersService.deleteUser(sub.userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Mutation(() => Boolean, { name: 'updateUser' })
  async updateUser(
    @Context() context: any,
    @Args('input') input: UpdateUserInput,
  ) {
    const { sub } = await context.req.user;
    return await this.usersService.updateUser(sub.userId, input);
  }
}
