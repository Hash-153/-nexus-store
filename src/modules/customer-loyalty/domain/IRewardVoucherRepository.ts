import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { RewardVoucher } from "./RewardVoucher.ts";

export interface IRewardVoucherFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IRewardVoucherRepository extends IRepository<RewardVoucher> {
  findByName(name: string): Promise<RewardVoucher | null>;
  findByCode?(code: string): Promise<RewardVoucher | null>;
  findFiltered(options?: IRewardVoucherFilterOptions): Promise<RewardVoucher[]>;
  count(options?: IRewardVoucherFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: RewardVoucher[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
