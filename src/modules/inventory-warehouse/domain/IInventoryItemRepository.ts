import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { InventoryItem } from "./InventoryItem.ts";

export interface IInventoryItemFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IInventoryItemRepository extends IRepository<InventoryItem> {
  findByName(name: string): Promise<InventoryItem | null>;
  findByCode?(code: string): Promise<InventoryItem | null>;
  findFiltered(options?: IInventoryItemFilterOptions): Promise<InventoryItem[]>;
  count(options?: IInventoryItemFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: InventoryItem[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
