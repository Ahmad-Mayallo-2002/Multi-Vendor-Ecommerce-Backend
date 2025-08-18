import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { DeviceService } from './device.service';
import { UserDevices } from '../common/enum/user-devices.type';
import GraphQLJSON from 'graphql-type-json';
// import your AuthGuard that sets context.user

@Resolver(() => Boolean)
export class NotificationResolver {
  constructor(
    private readonly notifications: NotificationService,
    private readonly devices: DeviceService,
  ) {}

  @Mutation(() => Boolean, { name: 'registerFcmToken' })
  // @UseGuards(AuthGuard)
  async registerFcmToken(
    @Args('token') token: string,
    @Args('platform', { type: () => String, nullable: true })
    platform: UserDevices,
    @Context() ctx: any,
  ) {
    const user = ctx.req.user; // ensure your AuthGuard populates this
    await this.devices.registerToken(user, token, platform);
    return true;
  }

  @Mutation(() => Boolean, { name: 'sendPushToUser' })
  // @UseGuards(AdminGuard) // protect who can send pushes
  async sendPushToUser(
    @Args('userId') userId: string,
    @Args('title', { nullable: true }) title: string,
    @Args('body', { nullable: true }) body: string,
    @Args('data', { nullable: true, type: () => GraphQLJSON })
    data?: Record<string, string>,
  ) {
    const tokens = await this.devices.getActiveTokensForUser(userId);
    if (!tokens.length) return true;
    const res = await this.notifications.sendToMany(tokens, {
      title,
      body,
      data,
    });
    // optional: deactivate invalid tokens
    const badTokens: string[] = [];
    res.responses.forEach((r, i) => {
      if (r.error?.code === 'messaging/registration-token-not-registered') {
        badTokens.push(tokens[i]);
      }
    });
    if (badTokens.length) await this.devices.removeInvalidTokens(badTokens);
    return true;
  }

  @Mutation(() => Boolean, { name: 'sendPushToToken' })
  async sendPushToToken(
    @Args('token') token: string,
    @Args('title', { nullable: true }) title?: string,
    @Args('body', { nullable: true }) body?: string,
    @Args('data', { nullable: true, type: () => GraphQLJSON })
    data?: Record<string, string>,
  ) {
    await this.notifications.sendToToken(token, { title, body, data });
    return true;
  }

  @Mutation(() => Boolean)
  async subscribeUserToTopic(
    @Args('userId') userId: string,
    @Args('topic') topic: string,
  ) {
    const tokens = await this.devices.getActiveTokensForUser(userId);
    if (!tokens.length) return true;
    await this.notifications.subscribeTokensToTopic(tokens, topic);
    return true;
  }
}
