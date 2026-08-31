import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ReferralRecord } from "./ReferralRecord.ts";

export interface IReferralRecordFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IReferralRecordRepository extends IRepository<ReferralRecord> {
  findByName(name: string): Promise<ReferralRecord | null>;
  findByCode?(code: string): Promise<ReferralRecord | null>;
  findFiltered(options?: IReferralRecordFilterOptions): Promise<ReferralRecord[]>;
  count(options?: IReferralRecordFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ReferralRecord[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
