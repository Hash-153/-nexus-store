import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ProductMedia } from "./ProductMedia.ts";

export interface IProductMediaFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IProductMediaRepository extends IRepository<ProductMedia> {
  findByName(name: string): Promise<ProductMedia | null>;
  findByCode?(code: string): Promise<ProductMedia | null>;
  findFiltered(options?: IProductMediaFilterOptions): Promise<ProductMedia[]>;
  count(options?: IProductMediaFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ProductMedia[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
