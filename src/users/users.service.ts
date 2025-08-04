import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import {
  createGetAllLoader,
  createGetByIdLoader,
} from '../common/utils/dataloader.factory';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await createGetAllLoader(this.userRepo, []).load('__all__');
    if (!users.length) throw new NotFoundException('No Users Here');
    return users as User[];
  }

  async getUser(id: string): Promise<User> {
    const user = await createGetByIdLoader(this.userRepo, []).load(id);
    return user as User;
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
