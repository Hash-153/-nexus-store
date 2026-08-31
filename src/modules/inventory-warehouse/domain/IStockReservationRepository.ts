import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { StockReservation } from "./StockReservation.ts";

export interface IStockReservationFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IStockReservationRepository extends IRepository<StockReservation> {
  findByName(name: string): Promise<StockReservation | null>;
  findByCode?(code: string): Promise<StockReservation | null>;
  findFiltered(options?: IStockReservationFilterOptions): Promise<StockReservation[]>;
  count(options?: IStockReservationFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: StockReservation[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
