import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { RateTable } from "./RateTable.ts";

export interface IRateTableFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IRateTableRepository extends IRepository<RateTable> {
  findByName(name: string): Promise<RateTable | null>;
  findByCode?(code: string): Promise<RateTable | null>;
  findFiltered(options?: IRateTableFilterOptions): Promise<RateTable[]>;
  count(options?: IRateTableFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: RateTable[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
