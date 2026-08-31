import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { ReserveStockDTO, InventoryResponseDTO } from "./dtos/InventoryDTOs.ts";
import type { IInventoryRepository } from "../domain/IInventoryRepository.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { SKU } from "../../../shared/domain/value-objects/SKU.ts";
import { Quantity } from "../../../shared/domain/value-objects/Quantity.ts";
import { NotFoundError } from "../../../shared/errors/DomainError.ts";

export class ReserveStockUseCase implements IUseCase<ReserveStockDTO, InventoryResponseDTO> {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(dto: ReserveStockDTO): Promise<InventoryResponseDTO> {
    const sku = SKU.create(dto.sku);
    const item = await this.inventoryRepository.findBySku(sku.value);

    if (!item) {
      throw new NotFoundError("InventoryItem for SKU", sku.value);
    }

    item.reserve(Quantity.create(dto.quantity));
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
