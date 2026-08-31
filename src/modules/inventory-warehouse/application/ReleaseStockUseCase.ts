import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { ReleaseStockDTO, InventoryResponseDTO } from "./dtos/InventoryDTOs.ts";
import type { IInventoryRepository } from "../domain/IInventoryRepository.ts";
import { SKU } from "../../../shared/domain/value-objects/SKU.ts";
import { Quantity } from "../../../shared/domain/value-objects/Quantity.ts";
import { NotFoundError } from "../../../shared/errors/DomainError.ts";

export class ReleaseStockUseCase implements IUseCase<ReleaseStockDTO, InventoryResponseDTO> {
  constructor(private readonly inventoryRepository: IInventoryRepository) {}

  public async execute(dto: ReleaseStockDTO): Promise<InventoryResponseDTO> {
    const sku = SKU.create(dto.sku);
    const item = await this.inventoryRepository.findBySku(sku.value);

    if (!item) {
      throw new NotFoundError("InventoryItem for SKU", sku.value);
    }

    item.releaseReservation(Quantity.create(dto.quantity));
    await this.inventoryRepository.save(item);

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
