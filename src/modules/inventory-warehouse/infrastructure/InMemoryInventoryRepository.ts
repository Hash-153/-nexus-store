import { InMemoryRepository } from "../../../shared/infrastructure/Repository.ts";
import { InventoryItem } from "../domain/InventoryItem.ts";
import type { IInventoryRepository } from "../domain/IInventoryRepository.ts";

export class InMemoryInventoryRepository extends InMemoryRepository<InventoryItem> implements IInventoryRepository {
  public async findBySku(sku: string): Promise<InventoryItem | null> {
    const normalized = sku.trim().toUpperCase();
    for (const item of this.items.values()) {
      if (item.sku.value === normalized) {
        return item;
      }
    }
    return null;
  }

  public async findByWarehouse(warehouseLocation: string): Promise<InventoryItem[]> {
    const normalized = warehouseLocation.trim().toLowerCase();
    return Array.from(this.items.values()).filter(
      (item) => item.warehouseLocation.toLowerCase() === normalized
    );
  }
}
