import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class ExistsPipe<T extends ObjectLiteral> implements PipeTransform {
  constructor(
    private readonly repository: Repository<T>,
    private readonly entityName: string = 'Entity',
  ) {}
  async transform(value: any, _metadata: ArgumentMetadata): Promise<any> {
    const entity = await this.repository.findOne({ where: { id: value } });

    if (!entity) throw new NotFoundException(`${this.entityName} is not found`);

    return value;
  }
}
