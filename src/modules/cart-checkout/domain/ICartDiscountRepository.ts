import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CartDiscount } from "./CartDiscount.ts";

export interface ICartDiscountFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICartDiscountRepository extends IRepository<CartDiscount> {
  findByName(name: string): Promise<CartDiscount | null>;
  findByCode?(code: string): Promise<CartDiscount | null>;
  findFiltered(options?: ICartDiscountFilterOptions): Promise<CartDiscount[]>;
  count(options?: ICartDiscountFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CartDiscount[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
