import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { SavedForLaterItem } from "./SavedForLaterItem.ts";

export interface ISavedForLaterItemFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ISavedForLaterItemRepository extends IRepository<SavedForLaterItem> {
  findByName(name: string): Promise<SavedForLaterItem | null>;
  findByCode?(code: string): Promise<SavedForLaterItem | null>;
  findFiltered(options?: ISavedForLaterItemFilterOptions): Promise<SavedForLaterItem[]>;
  count(options?: ISavedForLaterItemFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: SavedForLaterItem[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
