import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'getAllUsers' })
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @Query(() => User, { name: 'getUser' })
  async getUser(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<User> {
    return await this.usersService.getUser(userId);
  }

  @Mutation(() => Boolean, { name: 'removeUser' })
  async removeUser(@Args('userId', { type: () => String }) userId: string) {
    return await this.usersService.deleteUser(userId);
  }

  @Mutation(() => Boolean, { name: 'updateUser' })
  async updateUser(
    @Args('userId', { type: () => String }) userId: string,
    @Args('input') input: UpdateUserInput,
  ) {
    return await this.usersService.updateUser(userId, input);
  }
}
