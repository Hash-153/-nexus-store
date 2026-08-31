import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PointsLedgerEntry } from "./PointsLedgerEntry.ts";

export interface IPointsLedgerEntryFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPointsLedgerEntryRepository extends IRepository<PointsLedgerEntry> {
  findByName(name: string): Promise<PointsLedgerEntry | null>;
  findByCode?(code: string): Promise<PointsLedgerEntry | null>;
  findFiltered(options?: IPointsLedgerEntryFilterOptions): Promise<PointsLedgerEntry[]>;
  count(options?: IPointsLedgerEntryFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PointsLedgerEntry[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
