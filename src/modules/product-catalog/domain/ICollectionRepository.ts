import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Collection } from "./Collection.ts";

export interface ICollectionFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICollectionRepository extends IRepository<Collection> {
  findByName(name: string): Promise<Collection | null>;
  findByCode?(code: string): Promise<Collection | null>;
  findFiltered(options?: ICollectionFilterOptions): Promise<Collection[]>;
  count(options?: ICollectionFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: Collection[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
