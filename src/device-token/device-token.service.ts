import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceToken } from './entity/device-token.entity';
import { In, Repository } from 'typeorm';
import { CreateDeviceTokenInput } from './dto/create-device-token.input';
import { UpdateDeviceTokenInput } from './dto/update-device-token.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DeviceTokenService {
  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokenRepo: Repository<DeviceToken>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getAllDeviceTokens(): Promise<DeviceToken[]> {
    const tokens = await this.deviceTokenRepo.find();
    if (!tokens.length) throw new NotFoundException('Tokens are not found');
    return tokens;
  }

  async getDeviceTokenByUserId(userId: string): Promise<DeviceToken> {
    const token = await this.deviceTokenRepo.findOneBy({ userId });
    if (!token) throw new NotFoundException('Token is not found');
    return token;
  }

  async getDevicesTokensByUsersIds(userIds: string[]): Promise<DeviceToken[]> {
    const tokens = await this.deviceTokenRepo.findBy({ userId: In(userIds) });
    if (!tokens.length) throw new NotFoundException('Tokens are not found');
    return tokens;
  }

  async createDeviceToken(input: CreateDeviceTokenInput): Promise<DeviceToken> {
    const deviceToken = this.deviceTokenRepo.create(input);
    return await this.deviceTokenRepo.save(deviceToken);
  }

  async changeDeviceToken(input: UpdateDeviceTokenInput): Promise<DeviceToken> {
    const currentToken = await this.getDeviceTokenByUserId(input.userId);
    if (!currentToken) {
      return await this.createDeviceToken(input);
    } else if (currentToken.token !== input.token) {
      currentToken.token = input.token;
      return await this.deviceTokenRepo.save(currentToken);
    }
    return currentToken;
  }
}
