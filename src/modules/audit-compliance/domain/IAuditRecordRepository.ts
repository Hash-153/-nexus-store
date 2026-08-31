import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { AuditRecord } from "./AuditRecord.ts";

export interface IAuditRecordFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IAuditRecordRepository extends IRepository<AuditRecord> {
  findByName(name: string): Promise<AuditRecord | null>;
  findByCode?(code: string): Promise<AuditRecord | null>;
  findFiltered(options?: IAuditRecordFilterOptions): Promise<AuditRecord[]>;
  count(options?: IAuditRecordFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: AuditRecord[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
