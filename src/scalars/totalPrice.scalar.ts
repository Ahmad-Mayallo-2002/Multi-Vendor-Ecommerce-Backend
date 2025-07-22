import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('price')
export class PriceScalar implements CustomScalar<number, number> {
  description = 'Total Price Scalar Stores as Cents';

  parseValue(value: number): number {
    return Math.round(value * 100);
  }

  serialize(value: number): number {
    return value / 100;
  }

  parseLiteral(ast: ValueNode): number {
    if (ast.kind === Kind.FLOAT || ast.kind === Kind.INT)
      return Math.round(parseFloat(ast.value) * 100);
    return 0;
  }
}
