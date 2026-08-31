import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { AdjustStockDTO, InventoryResponseDTO } from "./dtos/InventoryDTOs.ts";
import type { IInventoryRepository } from "../domain/IInventoryRepository.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { SKU } from "../../../shared/domain/value-objects/SKU.ts";
import { Quantity } from "../../../shared/domain/value-objects/Quantity.ts";
import { InventoryItem } from "../domain/InventoryItem.ts";

export class AdjustStockUseCase implements IUseCase<AdjustStockDTO, InventoryResponseDTO> {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(dto: AdjustStockDTO): Promise<InventoryResponseDTO> {
    const sku = SKU.create(dto.sku);
    let item = await this.inventoryRepository.findBySku(sku.value);

    if (!item) {
      const initialQty = dto.quantityChange > 0 ? Quantity.create(dto.quantityChange) : Quantity.zero();
      const threshold = dto.reorderThreshold !== undefined ? Quantity.create(dto.reorderThreshold) : Quantity.create(5);
      item = InventoryItem.create({
        sku,
        warehouseLocation: dto.warehouseLocation ?? "MAIN_DC",
        initialQuantity: initialQty,
        reorderThreshold: threshold,
      });
    } else {
      if (dto.quantityChange > 0) {
        item.restock(Quantity.create(dto.quantityChange));
      } else if (dto.quantityChange < 0) {
        item.reserve(Quantity.create(Math.abs(dto.quantityChange)));
      }
    }

    await this.inventoryRepository.save(item);
    await this.eventBus.publishAll(item.domainEvents);
    item.clearEvents();

    return {
      id: item.id,
      sku: item.sku.value,
      warehouseLocation: item.warehouseLocation,
      availableQuantity: item.availableQuantity.value,
      reservedQuantity: item.reservedQuantity.value,
      totalOnHand: item.totalOnHand.value,
      reorderThreshold: item.reorderThreshold.value,
    };
  }
}
