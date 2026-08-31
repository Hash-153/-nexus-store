import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CustomerGroupDiscount } from "./CustomerGroupDiscount.ts";

export interface ICustomerGroupDiscountFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICustomerGroupDiscountRepository extends IRepository<CustomerGroupDiscount> {
  findByName(name: string): Promise<CustomerGroupDiscount | null>;
  findByCode?(code: string): Promise<CustomerGroupDiscount | null>;
  findFiltered(options?: ICustomerGroupDiscountFilterOptions): Promise<CustomerGroupDiscount[]>;
  count(options?: ICustomerGroupDiscountFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CustomerGroupDiscount[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
