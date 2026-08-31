import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { LoyaltyAccount } from "./LoyaltyAccount.ts";

export interface ILoyaltyAccountFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ILoyaltyAccountRepository extends IRepository<LoyaltyAccount> {
  findByName(name: string): Promise<LoyaltyAccount | null>;
  findByCode?(code: string): Promise<LoyaltyAccount | null>;
  findFiltered(options?: ILoyaltyAccountFilterOptions): Promise<LoyaltyAccount[]>;
  count(options?: ILoyaltyAccountFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: LoyaltyAccount[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
