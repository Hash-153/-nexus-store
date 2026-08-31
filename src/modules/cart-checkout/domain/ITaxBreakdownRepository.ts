import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { TaxBreakdown } from "./TaxBreakdown.ts";

export interface ITaxBreakdownFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ITaxBreakdownRepository extends IRepository<TaxBreakdown> {
  findByName(name: string): Promise<TaxBreakdown | null>;
  findByCode?(code: string): Promise<TaxBreakdown | null>;
  findFiltered(options?: ITaxBreakdownFilterOptions): Promise<TaxBreakdown[]>;
  count(options?: ITaxBreakdownFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: TaxBreakdown[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
