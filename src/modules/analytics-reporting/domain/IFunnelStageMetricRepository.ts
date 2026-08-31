import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { FunnelStageMetric } from "./FunnelStageMetric.ts";

export interface IFunnelStageMetricFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IFunnelStageMetricRepository extends IRepository<FunnelStageMetric> {
  findByName(name: string): Promise<FunnelStageMetric | null>;
  findByCode?(code: string): Promise<FunnelStageMetric | null>;
  findFiltered(options?: IFunnelStageMetricFilterOptions): Promise<FunnelStageMetric[]>;
  count(options?: IFunnelStageMetricFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: FunnelStageMetric[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
