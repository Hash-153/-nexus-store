import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { FlashSale } from "./FlashSale.ts";

export interface IFlashSaleFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IFlashSaleRepository extends IRepository<FlashSale> {
  findByName(name: string): Promise<FlashSale | null>;
  findByCode?(code: string): Promise<FlashSale | null>;
  findFiltered(options?: IFlashSaleFilterOptions): Promise<FlashSale[]>;
  count(options?: IFlashSaleFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: FlashSale[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
