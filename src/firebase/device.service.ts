import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDevice } from './entity/user-device.entity';
import { User } from '../users/entities/user.entity';
import { UserDevices } from '../common/enum/user-devices.type';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(UserDevice) private repo: Repository<UserDevice>,
  ) {}

  async registerToken(
    user: User,
    fcmToken: string,
    platform?: UserDevices,
  ) {
    let device = await this.repo.findOne({ where: { fcmToken } });
    if (!device) {
      device = this.repo.create({ user, fcmToken, platform, active: true });
    } else {
      device.user = user; // ensure association
      device.platform = platform ?? device.platform;
      device.active = true;
    }
    return this.repo.save(device);
  }

  async deactivateToken(fcmToken: string) {
    await this.repo.update({ fcmToken }, { active: false });
  }

  async getActiveTokensForUser(userId: string) {
    const devices = await this.repo.find({
      where: { user: { id: userId }, active: true },
    });
    return devices.map((d) => d.fcmToken);
  }

  async removeInvalidTokens(tokens: string[]) {
    await this.repo
      .createQueryBuilder()
      .update(UserDevice)
      .set({ active: false })
      .where('fcmToken IN (:...tokens)', { tokens })
      .execute();
  }
}
