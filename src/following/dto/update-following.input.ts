import { CreateFollowingInput } from './create-following.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFollowingInput extends PartialType(CreateFollowingInput) {}
