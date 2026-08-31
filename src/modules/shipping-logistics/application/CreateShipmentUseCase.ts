import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { CreateShipmentDTO, ShipmentResponseDTO } from "./dtos/ShippingDTOs.ts";
import type { IShipmentRepository } from "../domain/IShipmentRepository.ts";
import type { IOrderRepository } from "../../order-management/domain/IOrderRepository.ts";
import type { IInventoryRepository } from "../../inventory-warehouse/domain/IInventoryRepository.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Shipment } from "../domain/Shipment.ts";
import { OrderStatus } from "../../order-management/domain/OrderStatus.ts";
import { NotFoundError, BusinessRuleViolationError } from "../../../shared/errors/DomainError.ts";

export class CreateShipmentUseCase implements IUseCase<CreateShipmentDTO, ShipmentResponseDTO> {
  constructor(
    private readonly shipmentRepository: IShipmentRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(dto: CreateShipmentDTO): Promise<ShipmentResponseDTO> {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) {
      throw new NotFoundError("Order", dto.orderId);
    }

    if (order.status !== OrderStatus.PAID && order.status !== OrderStatus.PROCESSING) {
      throw new BusinessRuleViolationError(
        `Cannot create shipment for order in '${order.status}' status. Order must be PAID or PROCESSING.`
      );
    }

    const existingShipment = await this.shipmentRepository.findByOrderId(order.id);
    if (existingShipment) {
      throw new BusinessRuleViolationError(`Shipment already exists for order '${order.id}'.`);
    }

    // Fulfill inventory reservations
    for (const item of order.items) {
      const inventory = await this.inventoryRepository.findBySku(item.sku.value);
      if (inventory) {
        inventory.fulfillReservation(item.quantity);
        await this.inventoryRepository.save(inventory);
      }
    }

    const shipment = Shipment.create({
      orderId: order.id,
      carrier: dto.carrier,
      trackingNumber: dto.trackingNumber,
      shippingAddress: order.shippingAddress,
      estimatedDeliveryDays: dto.estimatedDeliveryDays,
    });

    order.markAsShipped();
    await this.orderRepository.save(order);
    await this.eventBus.publishAll(order.domainEvents);
    order.clearEvents();

    await this.shipmentRepository.save(shipment);

    return {
      id: shipment.id,
      orderId: shipment.orderId,
      carrier: shipment.carrier,
      trackingNumber: shipment.trackingNumber,
      shippingAddress: shipment.shippingAddress.format(),
      status: shipment.status,
      estimatedDeliveryDate: shipment.props.estimatedDeliveryDate?.toISOString(),
      createdAt: shipment.createdAt.toISOString(),
    };
  }
}
