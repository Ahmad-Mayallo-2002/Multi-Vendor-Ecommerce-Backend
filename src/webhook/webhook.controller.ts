import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { log } from 'console';
import { Request } from 'express';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2025-06-30.basil',
});

@Controller('webhook')
export class WebhookController {
  constructor(private orderService: OrdersService) {}

  @Post()
  @HttpCode(200)
  async handleStripeHook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;
    const endPointSecret = `${process.env.WEBHOOK_SECRET}`;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endPointSecret,
      );
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(`Webhook error: ${error.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.orderService.markOrderAsPaid(paymentIntent.id);
        log(`PaymentIntent was successful! ${paymentIntent.id}`);
        break;
      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        await this.orderService.markOrderAsFailed(failedIntent.id);
        console.log(`Payment Failed ${failedIntent.id}`);
        break;
      case 'charge.refunded':
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent)
          await this.orderService.refundOrder(charge.payment_intent.toString());
        break;
      default:
        log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}
