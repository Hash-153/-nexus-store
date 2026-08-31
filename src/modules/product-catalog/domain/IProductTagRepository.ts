import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ProductTag } from "./ProductTag.ts";

export interface IProductTagFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IProductTagRepository extends IRepository<ProductTag> {
  findByName(name: string): Promise<ProductTag | null>;
  findByCode?(code: string): Promise<ProductTag | null>;
  findFiltered(options?: IProductTagFilterOptions): Promise<ProductTag[]>;
  count(options?: IProductTagFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ProductTag[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
