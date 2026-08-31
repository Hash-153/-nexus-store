import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { OrderCancellation } from "./OrderCancellation.ts";

export interface IOrderCancellationFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IOrderCancellationRepository extends IRepository<OrderCancellation> {
  findByName(name: string): Promise<OrderCancellation | null>;
  findByCode?(code: string): Promise<OrderCancellation | null>;
  findFiltered(options?: IOrderCancellationFilterOptions): Promise<OrderCancellation[]>;
  count(options?: IOrderCancellationFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: OrderCancellation[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
