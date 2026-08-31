import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Invoice } from "./Invoice.ts";

export interface IInvoiceFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IInvoiceRepository extends IRepository<Invoice> {
  findByName(name: string): Promise<Invoice | null>;
  findByCode?(code: string): Promise<Invoice | null>;
  findFiltered(options?: IInvoiceFilterOptions): Promise<Invoice[]>;
  count(options?: IInvoiceFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: Invoice[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
