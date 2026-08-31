import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { SegmentRule } from "./SegmentRule.ts";

export interface ISegmentRuleFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ISegmentRuleRepository extends IRepository<SegmentRule> {
  findByName(name: string): Promise<SegmentRule | null>;
  findByCode?(code: string): Promise<SegmentRule | null>;
  findFiltered(options?: ISegmentRuleFilterOptions): Promise<SegmentRule[]>;
  count(options?: ISegmentRuleFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: SegmentRule[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
