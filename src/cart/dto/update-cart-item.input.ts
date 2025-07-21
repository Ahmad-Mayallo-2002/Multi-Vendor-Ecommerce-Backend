import { CreateCartItemInput } from './create-cart-item.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCartItemInput extends PartialType(CreateCartItemInput) {}
