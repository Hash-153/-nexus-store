import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ProductBundle } from "./ProductBundle.ts";

export interface IProductBundleFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IProductBundleRepository extends IRepository<ProductBundle> {
  findByName(name: string): Promise<ProductBundle | null>;
  findByCode?(code: string): Promise<ProductBundle | null>;
  findFiltered(options?: IProductBundleFilterOptions): Promise<ProductBundle[]>;
  count(options?: IProductBundleFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ProductBundle[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
