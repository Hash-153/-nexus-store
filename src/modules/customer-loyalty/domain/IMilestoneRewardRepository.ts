import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { MilestoneReward } from "./MilestoneReward.ts";

export interface IMilestoneRewardFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IMilestoneRewardRepository extends IRepository<MilestoneReward> {
  findByName(name: string): Promise<MilestoneReward | null>;
  findByCode?(code: string): Promise<MilestoneReward | null>;
  findFiltered(options?: IMilestoneRewardFilterOptions): Promise<MilestoneReward[]>;
  count(options?: IMilestoneRewardFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: MilestoneReward[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
