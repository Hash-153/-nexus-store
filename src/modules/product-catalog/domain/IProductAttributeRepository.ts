import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ProductAttribute } from "./ProductAttribute.ts";

export interface IProductAttributeFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IProductAttributeRepository extends IRepository<ProductAttribute> {
  findByName(name: string): Promise<ProductAttribute | null>;
  findByCode?(code: string): Promise<ProductAttribute | null>;
  findFiltered(options?: IProductAttributeFilterOptions): Promise<ProductAttribute[]>;
  count(options?: IProductAttributeFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ProductAttribute[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
