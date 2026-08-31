import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Campaign } from "./Campaign.ts";

export interface ICampaignFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICampaignRepository extends IRepository<Campaign> {
  findByName(name: string): Promise<Campaign | null>;
  findByCode?(code: string): Promise<Campaign | null>;
  findFiltered(options?: ICampaignFilterOptions): Promise<Campaign[]>;
  count(options?: ICampaignFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: Campaign[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
