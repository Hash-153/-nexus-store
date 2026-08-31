import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { BinLocation } from "./BinLocation.ts";

export interface IBinLocationFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IBinLocationRepository extends IRepository<BinLocation> {
  findByName(name: string): Promise<BinLocation | null>;
  findByCode?(code: string): Promise<BinLocation | null>;
  findFiltered(options?: IBinLocationFilterOptions): Promise<BinLocation[]>;
  count(options?: IBinLocationFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: BinLocation[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
