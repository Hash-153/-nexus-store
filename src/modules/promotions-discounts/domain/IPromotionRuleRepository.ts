import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PromotionRule } from "./PromotionRule.ts";

export interface IPromotionRuleFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPromotionRuleRepository extends IRepository<PromotionRule> {
  findByName(name: string): Promise<PromotionRule | null>;
  findByCode?(code: string): Promise<PromotionRule | null>;
  findFiltered(options?: IPromotionRuleFilterOptions): Promise<PromotionRule[]>;
  count(options?: IPromotionRuleFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PromotionRule[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
