import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { CreateOrderFromCartDTO, OrderResponseDTO } from "./dtos/OrderDTOs.ts";
import type { IOrderRepository } from "../domain/IOrderRepository.ts";
import type { ICartRepository } from "../../cart-checkout/domain/ICartRepository.ts";
import type { IInventoryRepository } from "../../inventory-warehouse/domain/IInventoryRepository.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Order } from "../domain/Order.ts";
import { OrderItem } from "../domain/OrderItem.ts";
import { Address } from "../../../shared/domain/value-objects/Address.ts";
import { Money } from "../../../shared/domain/value-objects/Money.ts";
import { Quantity } from "../../../shared/domain/value-objects/Quantity.ts";
import { NotFoundError, ValidationError } from "../../../shared/errors/DomainError.ts";

export class CreateOrderFromCartUseCase implements IUseCase<CreateOrderFromCartDTO, OrderResponseDTO> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly cartRepository: ICartRepository,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(dto: CreateOrderFromCartDTO): Promise<OrderResponseDTO> {
    const cart = await this.cartRepository.findById(dto.cartId);
    if (!cart) {
      throw new NotFoundError("Cart", dto.cartId);
    }

    if (cart.items.length === 0) {
      throw new ValidationError("Cannot create an order from an empty cart.");
    }

    const shippingAddress = Address.create(dto.shippingAddress);
    const billingAddress = dto.billingAddress ? Address.create(dto.billingAddress) : undefined;

    // Reserve stock for all items
    for (const item of cart.items) {
      const inventory = await this.inventoryRepository.findBySku(item.sku.value);
      if (!inventory) {
        throw new NotFoundError("Inventory for SKU", item.sku.value);
      }
      inventory.reserve(item.quantity);
      await this.inventoryRepository.save(inventory);
    }

    const orderItems = cart.items.map((item) =>
      OrderItem.create({
        productId: item.productId,
        variantId: item.variantId,
        sku: item.sku,
        title: item.title,
        variantName: item.variantName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })
    );

    const shippingFee = dto.shippingFee
      ? Money.create(dto.shippingFee, cart.currency)
      : Money.zero(cart.currency);

    const discountedSubtotal = cart.total;
    const taxTotal = discountedSubtotal.multiply(0.05);

    const order = Order.create({
      userId: cart.userId,
      items: orderItems,
      shippingAddress,
      billingAddress,
      currency: cart.currency,
      discountTotal: cart.discountTotal,
      shippingFee,
      taxTotal,
      appliedCouponCode: cart.appliedCoupon?.code,
      notes: dto.notes,
    });

    await this.orderRepository.save(order);
    await this.eventBus.publishAll(order.domainEvents);
    order.clearEvents();

    cart.clear();
    await this.cartRepository.save(cart);

    return this.toDTO(order);
  }

  private toDTO(order: Order): OrderResponseDTO {
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
