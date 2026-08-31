import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { AuditLog } from "./AuditLog.ts";

export interface IAuditLogFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IAuditLogRepository extends IRepository<AuditLog> {
  findByName(name: string): Promise<AuditLog | null>;
  findByCode?(code: string): Promise<AuditLog | null>;
  findFiltered(options?: IAuditLogFilterOptions): Promise<AuditLog[]>;
  count(options?: IAuditLogFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: AuditLog[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
