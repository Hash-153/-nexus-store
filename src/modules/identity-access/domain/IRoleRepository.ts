import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Role } from "./Role.ts";

export interface IRoleFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IRoleRepository extends IRepository<Role> {
  findByName(name: string): Promise<Role | null>;
  findByCode?(code: string): Promise<Role | null>;
  findFiltered(options?: IRoleFilterOptions): Promise<Role[]>;
  count(options?: IRoleFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: Role[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
