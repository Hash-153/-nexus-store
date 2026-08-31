import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PriceDropSubscription } from "./PriceDropSubscription.ts";

export interface IPriceDropSubscriptionFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPriceDropSubscriptionRepository extends IRepository<PriceDropSubscription> {
  findByName(name: string): Promise<PriceDropSubscription | null>;
  findByCode?(code: string): Promise<PriceDropSubscription | null>;
  findFiltered(options?: IPriceDropSubscriptionFilterOptions): Promise<PriceDropSubscription[]>;
  count(options?: IPriceDropSubscriptionFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PriceDropSubscription[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
