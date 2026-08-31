import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { OrderAddress } from "./OrderAddress.ts";

export interface IOrderAddressFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IOrderAddressRepository extends IRepository<OrderAddress> {
  findByName(name: string): Promise<OrderAddress | null>;
  findByCode?(code: string): Promise<OrderAddress | null>;
  findFiltered(options?: IOrderAddressFilterOptions): Promise<OrderAddress[]>;
  count(options?: IOrderAddressFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: OrderAddress[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
