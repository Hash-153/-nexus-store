import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { InventoryItem } from "./InventoryItem.ts";

export interface IInventoryRepository extends IRepository<InventoryItem> {
  findBySku(sku: string): Promise<InventoryItem | null>;
  findByWarehouse(warehouseLocation: string): Promise<InventoryItem[]>;
}
