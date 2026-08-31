import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CustomerBadge } from "./CustomerBadge.ts";

export interface ICustomerBadgeFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICustomerBadgeRepository extends IRepository<CustomerBadge> {
  findByName(name: string): Promise<CustomerBadge | null>;
  findByCode?(code: string): Promise<CustomerBadge | null>;
  findFiltered(options?: ICustomerBadgeFilterOptions): Promise<CustomerBadge[]>;
  count(options?: ICustomerBadgeFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CustomerBadge[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
