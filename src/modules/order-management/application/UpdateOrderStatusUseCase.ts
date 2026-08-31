import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { UpdateOrderStatusDTO, OrderResponseDTO } from "./dtos/OrderDTOs.ts";
import type { IOrderRepository } from "../domain/IOrderRepository.ts";
import type { IInventoryRepository } from "../../inventory-warehouse/domain/IInventoryRepository.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { OrderStatus } from "../domain/OrderStatus.ts";
import { NotFoundError } from "../../../shared/errors/DomainError.ts";
import { Order } from "../domain/Order.ts";

export class UpdateOrderStatusUseCase implements IUseCase<UpdateOrderStatusDTO, OrderResponseDTO> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(dto: UpdateOrderStatusDTO): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) {
      throw new NotFoundError("Order", dto.orderId);
    }

    order.transitionTo(dto.newStatus, dto.reason);

    // If order cancelled, release inventory reservations
    if (dto.newStatus === OrderStatus.CANCELLED) {
      for (const item of order.items) {
        const inventory = await this.inventoryRepository.findBySku(item.sku.value);
        if (inventory) {
          inventory.releaseReservation(item.quantity);
          await this.inventoryRepository.save(inventory);
        }
      }
    }

    // If order delivered or shipped, fulfill reserved stock
    if (dto.newStatus === OrderStatus.SHIPPED) {
      for (const item of order.items) {
        const inventory = await this.inventoryRepository.findBySku(item.sku.value);
        if (inventory) {
          inventory.fulfillReservation(item.quantity);
          await this.inventoryRepository.save(inventory);
        }
      }
    }

    await this.orderRepository.save(order);
    await this.eventBus.publishAll(order.domainEvents);
    order.clearEvents();

    return {
      id: order.id,
      userId: order.userId,
      items: order.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        variantId: i.variantId,
        sku: i.sku.value,
        title: i.title,
        variantName: i.variantName,
        unitPrice: i.unitPrice.amount,
        quantity: i.quantity.value,
        lineTotal: i.lineTotal.amount,
      })),
      shippingAddress: order.shippingAddress.format(),
      billingAddress: order.billingAddress?.format(),
      currency: order.currency,
      subtotal: order.subtotal.amount,
      discountTotal: order.discountTotal.amount,
      shippingFee: order.shippingFee.amount,
      taxTotal: order.taxTotal.amount,
      total: order.total.amount,
      status: order.status,
      appliedCouponCode: order.appliedCouponCode,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}
