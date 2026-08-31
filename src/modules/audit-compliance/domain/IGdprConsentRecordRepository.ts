import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { GdprConsentRecord } from "./GdprConsentRecord.ts";

export interface IGdprConsentRecordFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IGdprConsentRecordRepository extends IRepository<GdprConsentRecord> {
  findByName(name: string): Promise<GdprConsentRecord | null>;
  findByCode?(code: string): Promise<GdprConsentRecord | null>;
  findFiltered(options?: IGdprConsentRecordFilterOptions): Promise<GdprConsentRecord[]>;
  count(options?: IGdprConsentRecordFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: GdprConsentRecord[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
