import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../common/enum/role.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { SortEnum } from '../common/enum/sort.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getAllUsers(
    take: number,
    skip: number,
    sortByCreated: SortEnum,
  ): Promise<User[]> {
    let order: Record<string, string> = {};
    if (sortByCreated) order.createdAt = sortByCreated;
    const users = await this.userRepo.find({
      where: { role: Role.USER },
      take,
      skip,
      order,
    });
    if (!users.length) throw new NotFoundException('No Users Here');
    return users;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    return user as User;
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<Boolean> {
    const user = await this.getUser(id);
    Object.assign(user, input);
    await this.userRepo.save(user);
    return true;
  }

  async deleteUser(id: string): Promise<Boolean> {
    const user = await this.getUser(id);
    await this.userRepo.remove(user);
    return true;
  }
}
