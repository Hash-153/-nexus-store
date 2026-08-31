import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { LoyaltyTier } from "./LoyaltyTier.ts";

export interface ILoyaltyTierFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ILoyaltyTierRepository extends IRepository<LoyaltyTier> {
  findByName(name: string): Promise<LoyaltyTier | null>;
  findByCode?(code: string): Promise<LoyaltyTier | null>;
  findFiltered(options?: ILoyaltyTierFilterOptions): Promise<LoyaltyTier[]>;
  count(options?: ILoyaltyTierFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: LoyaltyTier[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
