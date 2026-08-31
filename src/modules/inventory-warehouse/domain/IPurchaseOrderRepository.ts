import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PurchaseOrder } from "./PurchaseOrder.ts";

export interface IPurchaseOrderFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPurchaseOrderRepository extends IRepository<PurchaseOrder> {
  findByName(name: string): Promise<PurchaseOrder | null>;
  findByCode?(code: string): Promise<PurchaseOrder | null>;
  findFiltered(options?: IPurchaseOrderFilterOptions): Promise<PurchaseOrder[]>;
  count(options?: IPurchaseOrderFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PurchaseOrder[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
