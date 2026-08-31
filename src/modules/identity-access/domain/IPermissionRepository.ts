import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Permission } from "./Permission.ts";

export interface IPermissionFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPermissionRepository extends IRepository<Permission> {
  findByName(name: string): Promise<Permission | null>;
  findByCode?(code: string): Promise<Permission | null>;
  findFiltered(options?: IPermissionFilterOptions): Promise<Permission[]>;
  count(options?: IPermissionFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: Permission[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
