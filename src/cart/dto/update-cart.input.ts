import { CreateCartInput } from './create-cart.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCartInput extends PartialType(CreateCartInput) {}
