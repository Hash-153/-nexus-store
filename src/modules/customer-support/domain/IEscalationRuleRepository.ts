import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { EscalationRule } from "./EscalationRule.ts";

export interface IEscalationRuleFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IEscalationRuleRepository extends IRepository<EscalationRule> {
  findByName(name: string): Promise<EscalationRule | null>;
  findByCode?(code: string): Promise<EscalationRule | null>;
  findFiltered(options?: IEscalationRuleFilterOptions): Promise<EscalationRule[]>;
  count(options?: IEscalationRuleFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: EscalationRule[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
