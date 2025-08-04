// utils/dataloader.factory.ts
import { NotFoundException } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In, Repository, FindManyOptions } from 'typeorm';

export function createGetByIdLoader<Entity extends { id: string }>(
  repo: Repository<Entity>,
  relations: string[] = [],
): DataLoader<string, Entity | undefined> {
  return new DataLoader<string, Entity | undefined>(
    async (keys: readonly string[]) => {
      const items = await repo.find({
        where: { id: In([...keys]) },
        relations,
      } as FindManyOptions<Entity>);
      if (!items.length) throw new NotFoundException('Not Found');
      const map = new Map(items.map((item) => [item.id, item]));
      return keys.map((key) => map.get(key));
    },
  );
}

export function createGetAllLoader<Entity>(
  repo: { find: Function },
  relations: string[] = [],
): DataLoader<any, Entity[]> {
  return new DataLoader<any, Entity[]>(
    async () => {
      const items = await repo.find({ relations });
      if (!items.length) throw new NotFoundException('Not Found');
      return [items]; // return single array
    },
    {
      cacheKeyFn: () => '__all__',
    },
  );
}
