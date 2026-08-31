import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CurrencyConversion } from "./CurrencyConversion.ts";

export interface ICurrencyConversionFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICurrencyConversionRepository extends IRepository<CurrencyConversion> {
  findByName(name: string): Promise<CurrencyConversion | null>;
  findByCode?(code: string): Promise<CurrencyConversion | null>;
  findFiltered(options?: ICurrencyConversionFilterOptions): Promise<CurrencyConversion[]>;
  count(options?: ICurrencyConversionFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CurrencyConversion[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
