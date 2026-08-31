import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ProductPerformanceRecord } from "./ProductPerformanceRecord.ts";

export interface IProductPerformanceRecordFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IProductPerformanceRecordRepository extends IRepository<ProductPerformanceRecord> {
  findByName(name: string): Promise<ProductPerformanceRecord | null>;
  findByCode?(code: string): Promise<ProductPerformanceRecord | null>;
  findFiltered(options?: IProductPerformanceRecordFilterOptions): Promise<ProductPerformanceRecord[]>;
  count(options?: IProductPerformanceRecordFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ProductPerformanceRecord[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
