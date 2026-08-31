import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { InventoryTurnoverRecord } from "./InventoryTurnoverRecord.ts";

export interface IInventoryTurnoverRecordFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IInventoryTurnoverRecordRepository extends IRepository<InventoryTurnoverRecord> {
  findByName(name: string): Promise<InventoryTurnoverRecord | null>;
  findByCode?(code: string): Promise<InventoryTurnoverRecord | null>;
  findFiltered(options?: IInventoryTurnoverRecordFilterOptions): Promise<InventoryTurnoverRecord[]>;
  count(options?: IInventoryTurnoverRecordFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: InventoryTurnoverRecord[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
