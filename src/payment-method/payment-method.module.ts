import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodResolver } from './payment-method.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';

@Module({
  providers: [PaymentMethodResolver, PaymentMethodService],
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
})
export class PaymentMethodModule {}
