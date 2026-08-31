import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CustomerCohort } from "./CustomerCohort.ts";

export interface ICustomerCohortFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICustomerCohortRepository extends IRepository<CustomerCohort> {
  findByName(name: string): Promise<CustomerCohort | null>;
  findByCode?(code: string): Promise<CustomerCohort | null>;
  findFiltered(options?: ICustomerCohortFilterOptions): Promise<CustomerCohort[]>;
  count(options?: ICustomerCohortFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CustomerCohort[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
