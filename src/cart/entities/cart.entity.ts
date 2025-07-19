import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IdClass } from '../../assets/IdDate.entity';
import { Entity } from 'typeorm';

@Entity({ name: 'carts' })
@ObjectType()
export class Cart extends IdClass {}
