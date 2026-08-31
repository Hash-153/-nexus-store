import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ProfitMarginMetric } from "./ProfitMarginMetric.ts";

export interface IProfitMarginMetricFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IProfitMarginMetricRepository extends IRepository<ProfitMarginMetric> {
  findByName(name: string): Promise<ProfitMarginMetric | null>;
  findByCode?(code: string): Promise<ProfitMarginMetric | null>;
  findFiltered(options?: IProfitMarginMetricFilterOptions): Promise<ProfitMarginMetric[]>;
  count(options?: IProfitMarginMetricFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ProfitMarginMetric[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
