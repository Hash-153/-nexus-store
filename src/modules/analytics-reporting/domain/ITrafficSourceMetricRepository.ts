import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { TrafficSourceMetric } from "./TrafficSourceMetric.ts";

export interface ITrafficSourceMetricFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ITrafficSourceMetricRepository extends IRepository<TrafficSourceMetric> {
  findByName(name: string): Promise<TrafficSourceMetric | null>;
  findByCode?(code: string): Promise<TrafficSourceMetric | null>;
  findFiltered(options?: ITrafficSourceMetricFilterOptions): Promise<TrafficSourceMetric[]>;
  count(options?: ITrafficSourceMetricFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: TrafficSourceMetric[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
