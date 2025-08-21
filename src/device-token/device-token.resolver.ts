import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DeviceTokenService } from './device-token.service';
import { CreateDeviceTokenInput } from './dto/create-device-token.input';
import { UpdateDeviceTokenInput } from './dto/update-device-token.input';
import { DeviceToken } from './entity/device-token.entity';
import {
  DevicesTokensResponse,
  DeviceTokenResponse,
} from '../common/responses/entities-responses.response';

@Resolver(() => DeviceToken)
export class DeviceTokenResolver {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  @Query(() => DevicesTokensResponse, { name: 'deviceTokens' })
  async getAllDeviceTokens() {
    return this.deviceTokenService.getAllDeviceTokens();
  }

  @Query(() => DeviceTokenResponse, { name: 'deviceTokenByUserId' })
  async getDeviceTokenByUserId(@Args('userId') userId: string) {
    return this.deviceTokenService.getDeviceTokenByUserId(userId);
  }

  @Query(() => DevicesTokensResponse, { name: 'deviceTokensByUserIds' })
  async getDevicesTokensByUsersIds(
    @Args({ name: 'userIds', type: () => [String] }) userIds: string[],
  ) {
    return this.deviceTokenService.getDevicesTokensByUsersIds(userIds);
  }

  @Mutation(() => DeviceTokenResponse)
  async createDeviceToken(@Args('input') input: CreateDeviceTokenInput) {
    return this.deviceTokenService.createDeviceToken(input);
  }

  @Mutation(() => DeviceTokenResponse)
  async changeDeviceToken(@Args('input') input: UpdateDeviceTokenInput) {
    return this.deviceTokenService.changeDeviceToken(input);
  }
}
