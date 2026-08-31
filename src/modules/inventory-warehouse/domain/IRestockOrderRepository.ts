import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { RestockOrder } from "./RestockOrder.ts";

export interface IRestockOrderFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IRestockOrderRepository extends IRepository<RestockOrder> {
  findByName(name: string): Promise<RestockOrder | null>;
  findByCode?(code: string): Promise<RestockOrder | null>;
  findFiltered(options?: IRestockOrderFilterOptions): Promise<RestockOrder[]>;
  count(options?: IRestockOrderFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: RestockOrder[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
