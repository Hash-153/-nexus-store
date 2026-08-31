import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ProductVariant } from "./ProductVariant.ts";

export interface IProductVariantFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IProductVariantRepository extends IRepository<ProductVariant> {
  findByName(name: string): Promise<ProductVariant | null>;
  findByCode?(code: string): Promise<ProductVariant | null>;
  findFiltered(options?: IProductVariantFilterOptions): Promise<ProductVariant[]>;
  count(options?: IProductVariantFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ProductVariant[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
