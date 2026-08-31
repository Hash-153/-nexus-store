import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { InventoryAdjustment } from "./InventoryAdjustment.ts";

export interface IInventoryAdjustmentFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IInventoryAdjustmentRepository extends IRepository<InventoryAdjustment> {
  findByName(name: string): Promise<InventoryAdjustment | null>;
  findByCode?(code: string): Promise<InventoryAdjustment | null>;
  findFiltered(options?: IInventoryAdjustmentFilterOptions): Promise<InventoryAdjustment[]>;
  count(options?: IInventoryAdjustmentFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: InventoryAdjustment[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
