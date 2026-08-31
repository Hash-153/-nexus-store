import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { RefundRateMetric } from "./RefundRateMetric.ts";

export interface IRefundRateMetricFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IRefundRateMetricRepository extends IRepository<RefundRateMetric> {
  findByName(name: string): Promise<RefundRateMetric | null>;
  findByCode?(code: string): Promise<RefundRateMetric | null>;
  findFiltered(options?: IRefundRateMetricFilterOptions): Promise<RefundRateMetric[]>;
  count(options?: IRefundRateMetricFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: RefundRateMetric[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
