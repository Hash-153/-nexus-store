import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { SecurityAlert } from "./SecurityAlert.ts";

export interface ISecurityAlertFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ISecurityAlertRepository extends IRepository<SecurityAlert> {
  findByName(name: string): Promise<SecurityAlert | null>;
  findByCode?(code: string): Promise<SecurityAlert | null>;
  findFiltered(options?: ISecurityAlertFilterOptions): Promise<SecurityAlert[]>;
  count(options?: ISecurityAlertFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: SecurityAlert[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
