import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { AbandonedCartRecord } from "./AbandonedCartRecord.ts";

export interface IAbandonedCartRecordFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IAbandonedCartRecordRepository extends IRepository<AbandonedCartRecord> {
  findByName(name: string): Promise<AbandonedCartRecord | null>;
  findByCode?(code: string): Promise<AbandonedCartRecord | null>;
  findFiltered(options?: IAbandonedCartRecordFilterOptions): Promise<AbandonedCartRecord[]>;
  count(options?: IAbandonedCartRecordFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: AbandonedCartRecord[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
