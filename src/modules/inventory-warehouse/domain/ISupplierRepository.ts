import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Supplier } from "./Supplier.ts";

export interface ISupplierFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ISupplierRepository extends IRepository<Supplier> {
  findByName(name: string): Promise<Supplier | null>;
  findByCode?(code: string): Promise<Supplier | null>;
  findFiltered(options?: ISupplierFilterOptions): Promise<Supplier[]>;
  count(options?: ISupplierFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: Supplier[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
