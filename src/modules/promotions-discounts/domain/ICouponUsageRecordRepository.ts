import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CouponUsageRecord } from "./CouponUsageRecord.ts";

export interface ICouponUsageRecordFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICouponUsageRecordRepository extends IRepository<CouponUsageRecord> {
  findByName(name: string): Promise<CouponUsageRecord | null>;
  findByCode?(code: string): Promise<CouponUsageRecord | null>;
  findFiltered(options?: ICouponUsageRecordFilterOptions): Promise<CouponUsageRecord[]>;
  count(options?: ICouponUsageRecordFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CouponUsageRecord[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
