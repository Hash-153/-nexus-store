import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { RatingSummary } from "./RatingSummary.ts";

export interface IRatingSummaryFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IRatingSummaryRepository extends IRepository<RatingSummary> {
  findByName(name: string): Promise<RatingSummary | null>;
  findByCode?(code: string): Promise<RatingSummary | null>;
  findFiltered(options?: IRatingSummaryFilterOptions): Promise<RatingSummary[]>;
  count(options?: IRatingSummaryFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: RatingSummary[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
