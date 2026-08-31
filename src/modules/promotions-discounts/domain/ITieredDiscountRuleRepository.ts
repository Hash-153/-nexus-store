import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { TieredDiscountRule } from "./TieredDiscountRule.ts";

export interface ITieredDiscountRuleFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ITieredDiscountRuleRepository extends IRepository<TieredDiscountRule> {
  findByName(name: string): Promise<TieredDiscountRule | null>;
  findByCode?(code: string): Promise<TieredDiscountRule | null>;
  findFiltered(options?: ITieredDiscountRuleFilterOptions): Promise<TieredDiscountRule[]>;
  count(options?: ITieredDiscountRuleFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: TieredDiscountRule[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
