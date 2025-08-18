import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { messaging } from 'firebase-admin';


type SendOptions = {
  title?: string;
  body?: string;
  data?: Record<string, string>;
  ttlSeconds?: number; // optional
  priority?: 'high' | 'normal';
};

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(@Inject('FIREBASE_MESSAGING') private messaging: messaging.Messaging) {}

  async sendToToken(token: string, opts: SendOptions) {
    const message = {
      token,
      notification:
        opts.title || opts.body
          ? { title: opts.title, body: opts.body }
          : undefined,
      data: opts.data,
      android: {
        priority: opts.priority === 'high' ? 'high' : 'normal',
        ttl: opts.ttlSeconds ? opts.ttlSeconds * 1000 : undefined,
      },
      apns: {
        headers:
          opts.priority === 'high'
            ? { 'apns-priority': '10' }
            : { 'apns-priority': '5' },
        payload: {
          aps: {
            'content-available': opts.data && !opts.title && !opts.body ? 1 : 0, // data-only = background
          },
        },
      },
      webpush: {
        headers: opts.ttlSeconds ? { TTL: String(opts.ttlSeconds) } : undefined,
      },
    };
    return this.messaging.send(message as any);
  }

  async sendToMany(tokens: string[], opts: SendOptions) {
    const message = {
      tokens,
      notification:
        opts.title || opts.body
          ? { title: opts.title, body: opts.body }
          : undefined,
      data: opts.data,
    };
    const res = await this.messaging.sendEachForMulticast(message);
    // Clean up invalid tokens in your DB by checking res.responses[i].error?.code
    this.logger.log(`Success: ${res.successCount}, Fail: ${res.failureCount}`);
    return res;
  }

  async sendToTopic(topic: string, opts: SendOptions) {
    const message = {
      topic,
      notification:
        opts.title || opts.body
          ? { title: opts.title, body: opts.body }
          : undefined,
      data: opts.data,
    };
    return this.messaging.send(message);
  }

  async subscribeTokensToTopic(tokens: string[], topic: string) {
    return this.messaging.subscribeToTopic(tokens, topic);
  }

  async unsubscribeTokensFromTopic(tokens: string[], topic: string) {
    return this.messaging.unsubscribeFromTopic(tokens, topic);
  }
}
