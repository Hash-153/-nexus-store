import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { StockLevel } from "./StockLevel.ts";

export interface IStockLevelFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IStockLevelRepository extends IRepository<StockLevel> {
  findByName(name: string): Promise<StockLevel | null>;
  findByCode?(code: string): Promise<StockLevel | null>;
  findFiltered(options?: IStockLevelFilterOptions): Promise<StockLevel[]>;
  count(options?: IStockLevelFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: StockLevel[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
