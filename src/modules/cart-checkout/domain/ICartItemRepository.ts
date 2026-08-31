import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CartItem } from "./CartItem.ts";

export interface ICartItemFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICartItemRepository extends IRepository<CartItem> {
  findByName(name: string): Promise<CartItem | null>;
  findByCode?(code: string): Promise<CartItem | null>;
  findFiltered(options?: ICartItemFilterOptions): Promise<CartItem[]>;
  count(options?: ICartItemFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CartItem[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
