import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Product } from "./Product.ts";

export interface ProductFilterOptions {
  categoryId?: string;
  isPublished?: boolean;
  searchQuery?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}

export interface IProductRepository extends IRepository<Product> {
  findBySlug(slug: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findPublished(options?: ProductFilterOptions): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
}
