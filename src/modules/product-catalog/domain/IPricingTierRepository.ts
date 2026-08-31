import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PricingTier } from "./PricingTier.ts";

export interface IPricingTierFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPricingTierRepository extends IRepository<PricingTier> {
  findByName(name: string): Promise<PricingTier | null>;
  findByCode?(code: string): Promise<PricingTier | null>;
  findFiltered(options?: IPricingTierFilterOptions): Promise<PricingTier[]>;
  count(options?: IPricingTierFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PricingTier[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
