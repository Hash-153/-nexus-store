import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { StockMovement } from "./StockMovement.ts";

export interface IStockMovementFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IStockMovementRepository extends IRepository<StockMovement> {
  findByName(name: string): Promise<StockMovement | null>;
  findByCode?(code: string): Promise<StockMovement | null>;
  findFiltered(options?: IStockMovementFilterOptions): Promise<StockMovement[]>;
  count(options?: IStockMovementFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: StockMovement[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
