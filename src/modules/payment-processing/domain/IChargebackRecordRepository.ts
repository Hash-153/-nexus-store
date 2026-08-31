import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ChargebackRecord } from "./ChargebackRecord.ts";

export interface IChargebackRecordFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IChargebackRecordRepository extends IRepository<ChargebackRecord> {
  findByName(name: string): Promise<ChargebackRecord | null>;
  findByCode?(code: string): Promise<ChargebackRecord | null>;
  findFiltered(options?: IChargebackRecordFilterOptions): Promise<ChargebackRecord[]>;
  count(options?: IChargebackRecordFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ChargebackRecord[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
