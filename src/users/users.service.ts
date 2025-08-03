import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { Role } from '../common/enum/role.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { SortEnum } from '../common/enum/sort.enum';
import DataLoader from 'dataloader';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  private userLoader = new DataLoader<string, User | undefined>(
    async (keys) => {
      const user = await this.userRepo.find({
        where: { id: In(keys) },
        relations: ['followings'],
      });
      const userMap = new Map(user.map((v) => [v.id, v]));
      const users = keys.map((v) => userMap.get(v));
      return users;
    },
  );

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
    return (await this.userLoader.load(id)) as User;
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<boolean> {
    const user = await this.getUser(id);
    Object.assign(user, input);
    await this.userRepo.save(user);
    return true;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.getUser(id);
    await this.userRepo.remove(user);
    return true;
  }
}
