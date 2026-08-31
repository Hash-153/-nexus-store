import { DomainEvent } from "../../../../shared/domain/DomainEvent.ts";

export interface ProductPriceChangedEventPayload {
  readonly aggregateId: string;
  readonly metadata?: Record<string, unknown>;
  readonly timestamp?: Date;
  readonly details?: string;
  readonly correlationId?: string;
  readonly actorId?: string;
}

/**
 * Domain Event: ProductPriceChangedEvent
 * Dispatched when  product price changed event occurs in product-catalog.
 */
export class ProductPriceChangedEvent extends DomainEvent {
  public readonly eventName = "ProductPriceChangedEvent";
  public readonly aggregateId: string;
  public readonly metadata: Record<string, unknown>;
  public readonly correlationId: string;
  public readonly actorId?: string;
  public readonly details?: string;

  constructor(payload: ProductPriceChangedEventPayload | string) {
    super();
    if (typeof payload === "string") {
      this.aggregateId = payload;
      this.metadata = {};
      this.correlationId = crypto.randomUUID();
    } else {
      this.aggregateId = payload.aggregateId;
      this.metadata = payload.metadata ?? {};
      this.correlationId = payload.correlationId ?? crypto.randomUUID();
      this.actorId = payload.actorId;
      this.details = payload.details;
    }
  }

  public override getAggregateId(): string {
    return this.aggregateId;
  }

  public toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      aggregateId: this.aggregateId,
      dateTimeOccurred: this.dateTimeOccurred.toISOString(),
      correlationId: this.correlationId,
      actorId: this.actorId,
      details: this.details,
      metadata: this.metadata,
    };
  }
}
