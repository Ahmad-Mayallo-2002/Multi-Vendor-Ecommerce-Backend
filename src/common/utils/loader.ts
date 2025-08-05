import DataLoader from "dataloader";
import { In, Repository, FindOptionsWhere } from "typeorm";

interface BaseEntity {
    id: string;
}

export function createDataLoader<T extends BaseEntity>(repo: Repository<T>) {
    return new DataLoader<string, T>(async (ids: readonly string[]) => {
        const whereCondidition = 
      const items = await repo.find({
        where: { id: In([...ids]) }
      });
      const itemMap = new Map<string, T>(items.map((i) => [i.id, i]));
      return ids.map((id) => itemMap.get(id) as T);
    });
}
