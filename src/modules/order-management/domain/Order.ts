import { AggregateRoot } from "../../../shared/domain/AggregateRoot.ts";
import { OrderItem } from "./OrderItem.ts";
import { OrderStatus, VALID_ORDER_TRANSITIONS } from "./OrderStatus.ts";
import { Money, type Currency } from "../../../shared/domain/value-objects/Money.ts";
import { Address } from "../../../shared/domain/value-objects/Address.ts";
import { OrderCreatedEvent, OrderStatusChangedEvent } from "./events/OrderCreatedEvent.ts";
import { BusinessRuleViolationError, ValidationError } from "../../../shared/errors/DomainError.ts";

export interface OrderProps {
  userId?: string | null;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  currency: Currency;
  subtotal: Money;
  discountTotal: Money;
  shippingFee: Money;
  taxTotal: Money;
  total: Money;
  status: OrderStatus;
  appliedCouponCode?: string | null;
  notes?: string;
  [key: string]: any;
}

export class Order extends AggregateRoot<OrderProps> {
  public constructor(props: OrderProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get userId(): string | null {
    return this.props.userId ?? null;
  }

  get items(): ReadonlyArray<OrderItem> {
    return [...this.props.items];
  }

  get shippingAddress(): Address {
    return this.props.shippingAddress;
  }

  get billingAddress(): Address | undefined {
    return this.props.billingAddress;
  }

  get currency(): Currency {
    return this.props.currency;
  }

  get subtotal(): Money {
    return this.props.subtotal;
  }

  get discountTotal(): Money {
    return this.props.discountTotal;
  }

  get shippingFee(): Money {
    return this.props.shippingFee;
  }

  get taxTotal(): Money {
    return this.props.taxTotal;
  }

  get total(): Money {
    return this.props.total;
  }

  get status(): OrderStatus {
    return this.props.status;
  }

  get appliedCouponCode(): string | null {
    return this.props.appliedCouponCode ?? null;
  }

  public static create(
    params: {
      userId?: string | null;
      items: OrderItem[];
      shippingAddress: Address;
      billingAddress?: Address;
      currency: Currency;
      discountTotal?: Money;
      shippingFee?: Money;
      taxTotal?: Money;
      appliedCouponCode?: string | null;
      notes?: string;
    },
    id?: string
  ): Order {
    if (!params.items || params.items.length === 0) {
      throw new ValidationError("An order must contain at least one line item.");
    }

    const discountTotal = params.discountTotal ?? Money.zero(params.currency);
    const shippingFee = params.shippingFee ?? Money.zero(params.currency);
    const taxTotal = params.taxTotal ?? Money.zero(params.currency);

    const subtotal = params.items.reduce(
      (acc, item) => acc.add(item.lineTotal),
      Money.zero(params.currency)
    );

    let total = subtotal;
    if (discountTotal.isLessThan(subtotal)) {
      total = subtotal.subtract(discountTotal);
    } else {
      total = Money.zero(params.currency);
    }
    total = total.add(shippingFee).add(taxTotal);

    const order = new Order(
      {
        userId: params.userId ?? null,
        items: params.items,
        shippingAddress: params.shippingAddress,
        billingAddress: params.billingAddress,
        currency: params.currency,
        subtotal,
        discountTotal,
        shippingFee,
        taxTotal,
        total,
        status: OrderStatus.PENDING_PAYMENT,
        appliedCouponCode: params.appliedCouponCode ?? null,
        notes: params.notes,
      },
      id
    );

    if (!id) {
      order.addDomainEvent(
        new OrderCreatedEvent(
          order.id,
          order.userId,
          order.total.amountInCents,
          order.currency
        )
      );
    }

    return order;
  }

  public static reconstitute(props: OrderProps, id: string, createdAt: Date, updatedAt: Date): Order {
    return new Order(props, id, createdAt, updatedAt);
  }

  public transitionTo(newStatus: OrderStatus, reason?: string): void {
    const validNextStates = VALID_ORDER_TRANSITIONS[this.props.status] || [];
    if (!validNextStates.includes(newStatus)) {
      throw new BusinessRuleViolationError(
        `Cannot transition order from '${this.props.status}' to '${newStatus}'. Valid transitions: [${validNextStates.join(", ")}]`
      );
    }

    const previousStatus = this.props.status;
    this.props.status = newStatus;
    this._updatedAt = new Date();

    this.addDomainEvent(
      new OrderStatusChangedEvent(this.id, previousStatus, newStatus, reason)
    );
  }

  public markAsPaid(): void {
    this.transitionTo(OrderStatus.PAID, "Payment verified successfully.");
  }

  public markAsProcessing(): void {
    this.transitionTo(OrderStatus.PROCESSING, "Order sent to warehouse for picking.");
  }

  public markAsShipped(): void {
    this.transitionTo(OrderStatus.SHIPPED, "Order handed over to shipping carrier.");
  }

  public markAsDelivered(): void {
    this.transitionTo(OrderStatus.DELIVERED, "Delivered to customer address.");
  }

  public cancel(reason: string): void {
    this.transitionTo(OrderStatus.CANCELLED, reason);
  }

  public refund(reason: string): void {
    this.transitionTo(OrderStatus.REFUNDED, reason);
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items.map((i) => ({
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
      shippingAddress: this.shippingAddress.format(),
      billingAddress: this.billingAddress?.format(),
      subtotal: this.subtotal.amount,
      discountTotal: this.discountTotal.amount,
      shippingFee: this.shippingFee.amount,
      taxTotal: this.taxTotal.amount,
      total: this.total.amount,
      status: this.status,
      appliedCouponCode: this.appliedCouponCode,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
