import { DomainEvent } from "../../../../shared/domain/DomainEvent.ts";
import { OrderStatus } from "../OrderStatus.ts";

export class OrderCreatedEvent extends DomainEvent {
  public readonly eventName = "OrderCreatedEvent";
  public readonly orderId: string;
  public readonly userId?: string | null;
  public readonly totalAmountInCents: number;
  public readonly currency: string;

  constructor(orderId: string, userId: string | null | undefined, totalAmountInCents: number, currency: string) {
    super();
    this.orderId = orderId;
    this.userId = userId;
    this.totalAmountInCents = totalAmountInCents;
    this.currency = currency;
  }

  public getAggregateId(): string {
    return this.orderId;
  }
}

export class OrderStatusChangedEvent extends DomainEvent {
  public readonly eventName = "OrderStatusChangedEvent";
  public readonly orderId: string;
  public readonly previousStatus: OrderStatus;
  public readonly newStatus: OrderStatus;
  public readonly reason?: string;

  constructor(orderId: string, previousStatus: OrderStatus, newStatus: OrderStatus, reason?: string) {
    super();
    this.orderId = orderId;
    this.previousStatus = previousStatus;
    this.newStatus = newStatus;
    this.reason = reason;
  }

  public getAggregateId(): string {
    return this.orderId;
  }
}
