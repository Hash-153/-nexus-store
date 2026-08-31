import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ReturnItem } from "./ReturnItem.ts";

export interface IReturnItemFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IReturnItemRepository extends IRepository<ReturnItem> {
  findByName(name: string): Promise<ReturnItem | null>;
  findByCode?(code: string): Promise<ReturnItem | null>;
  findFiltered(options?: IReturnItemFilterOptions): Promise<ReturnItem[]>;
  count(options?: IReturnItemFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ReturnItem[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
