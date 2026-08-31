import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { OrderItem } from "./OrderItem.ts";

export interface IOrderItemFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IOrderItemRepository extends IRepository<OrderItem> {
  findByName(name: string): Promise<OrderItem | null>;
  findByCode?(code: string): Promise<OrderItem | null>;
  findFiltered(options?: IOrderItemFilterOptions): Promise<OrderItem[]>;
  count(options?: IOrderItemFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: OrderItem[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
