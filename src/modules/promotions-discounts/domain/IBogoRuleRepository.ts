import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { BogoRule } from "./BogoRule.ts";

export interface IBogoRuleFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IBogoRuleRepository extends IRepository<BogoRule> {
  findByName(name: string): Promise<BogoRule | null>;
  findByCode?(code: string): Promise<BogoRule | null>;
  findFiltered(options?: IBogoRuleFilterOptions): Promise<BogoRule[]>;
  count(options?: IBogoRuleFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: BogoRule[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
