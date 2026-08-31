import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { DailySalesSnapshot } from "./DailySalesSnapshot.ts";

export interface IDailySalesSnapshotFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IDailySalesSnapshotRepository extends IRepository<DailySalesSnapshot> {
  findByName(name: string): Promise<DailySalesSnapshot | null>;
  findByCode?(code: string): Promise<DailySalesSnapshot | null>;
  findFiltered(options?: IDailySalesSnapshotFilterOptions): Promise<DailySalesSnapshot[]>;
  count(options?: IDailySalesSnapshotFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: DailySalesSnapshot[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
