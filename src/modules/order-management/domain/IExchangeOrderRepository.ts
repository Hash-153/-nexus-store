import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ExchangeOrder } from "./ExchangeOrder.ts";

export interface IExchangeOrderFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IExchangeOrderRepository extends IRepository<ExchangeOrder> {
  findByName(name: string): Promise<ExchangeOrder | null>;
  findByCode?(code: string): Promise<ExchangeOrder | null>;
  findFiltered(options?: IExchangeOrderFilterOptions): Promise<ExchangeOrder[]>;
  count(options?: IExchangeOrderFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ExchangeOrder[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
