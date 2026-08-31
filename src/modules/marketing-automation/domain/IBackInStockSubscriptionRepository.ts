import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { BackInStockSubscription } from "./BackInStockSubscription.ts";

export interface IBackInStockSubscriptionFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IBackInStockSubscriptionRepository extends IRepository<BackInStockSubscription> {
  findByName(name: string): Promise<BackInStockSubscription | null>;
  findByCode?(code: string): Promise<BackInStockSubscription | null>;
  findFiltered(options?: IBackInStockSubscriptionFilterOptions): Promise<BackInStockSubscription[]>;
  count(options?: IBackInStockSubscriptionFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: BackInStockSubscription[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
