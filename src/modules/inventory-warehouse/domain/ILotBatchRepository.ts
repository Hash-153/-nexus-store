import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { LotBatch } from "./LotBatch.ts";

export interface ILotBatchFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ILotBatchRepository extends IRepository<LotBatch> {
  findByName(name: string): Promise<LotBatch | null>;
  findByCode?(code: string): Promise<LotBatch | null>;
  findFiltered(options?: ILotBatchFilterOptions): Promise<LotBatch[]>;
  count(options?: ILotBatchFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: LotBatch[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
