import { DomainEvent } from "../../../../shared/domain/DomainEvent.ts";

export class PaymentCompletedEvent extends DomainEvent {
  public readonly eventName = "PaymentCompletedEvent";
  public readonly paymentId: string;
  public readonly orderId: string;
  public readonly amountInCents: number;
  public readonly currency: string;
  public readonly transactionReference: string;

  constructor(
    paymentId: string,
    orderId: string,
    amountInCents: number,
    currency: string,
    transactionReference: string
  ) {
    super();
    this.paymentId = paymentId;
    this.orderId = orderId;
    this.amountInCents = amountInCents;
    this.currency = currency;
    this.transactionReference = transactionReference;
  }

  public getAggregateId(): string {
    return this.paymentId;
  }
}
