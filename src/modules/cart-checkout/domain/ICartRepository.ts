import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Cart } from "./Cart.ts";

export interface ICartFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICartRepository extends IRepository<Cart> {
  findByName(name: string): Promise<Cart | null>;
  findByCode?(code: string): Promise<Cart | null>;
  findFiltered(options?: ICartFilterOptions): Promise<Cart[]>;
  count(options?: ICartFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: Cart[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
