import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import { UpdatePaymentMethodInput } from './dto/update-payment-method.input';

@Resolver(() => PaymentMethod)
export class PaymentMethodResolver {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Mutation(() => PaymentMethod)
  createPaymentMethod(
    @Args('createPaymentMethodInput')
    createPaymentMethodInput: CreatePaymentMethodInput,
  ) {
    return this.paymentMethodService.create(createPaymentMethodInput);
  }

  @Query(() => [PaymentMethod], { name: 'paymentMethod' })
  findAll() {
    return this.paymentMethodService.findAll();
  }

  @Query(() => PaymentMethod, { name: 'paymentMethod' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.paymentMethodService.findOne(id);
  }

  @Mutation(() => PaymentMethod)
  updatePaymentMethod(
    @Args('updatePaymentMethodInput')
    updatePaymentMethodInput: UpdatePaymentMethodInput,
  ) {
    return this.paymentMethodService.update(
      updatePaymentMethodInput.id,
      updatePaymentMethodInput,
    );
  }

  @Mutation(() => PaymentMethod)
  removePaymentMethod(@Args('id', { type: () => Int }) id: number) {
    return this.paymentMethodService.remove(id);
  }
}
