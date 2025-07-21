import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../assets/enum/role.enum';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepo.find({
      where: { role: Role.USER },
    });
    if (!users.length) throw new NotFoundException('No Users Here');
    return users;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException('User is not Found');
    return user;
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

  async approveVendor(vendorId: string) {
    
  } 
}
