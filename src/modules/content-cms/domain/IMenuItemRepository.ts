import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { MenuItem } from "./MenuItem.ts";

export interface IMenuItemFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IMenuItemRepository extends IRepository<MenuItem> {
  findByName(name: string): Promise<MenuItem | null>;
  findByCode?(code: string): Promise<MenuItem | null>;
  findFiltered(options?: IMenuItemFilterOptions): Promise<MenuItem[]>;
  count(options?: IMenuItemFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: MenuItem[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
