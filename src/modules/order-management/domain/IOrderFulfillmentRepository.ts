import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { OrderFulfillment } from "./OrderFulfillment.ts";

export interface IOrderFulfillmentFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IOrderFulfillmentRepository extends IRepository<OrderFulfillment> {
  findByName(name: string): Promise<OrderFulfillment | null>;
  findByCode?(code: string): Promise<OrderFulfillment | null>;
  findFiltered(options?: IOrderFulfillmentFilterOptions): Promise<OrderFulfillment[]>;
  count(options?: IOrderFulfillmentFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: OrderFulfillment[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
