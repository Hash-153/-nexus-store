import { AggregateRoot } from "../../../shared/domain/AggregateRoot.ts";
import { PaymentStatus, PaymentMethod } from "./PaymentStatus.ts";
import { Money } from "../../../shared/domain/value-objects/Money.ts";
import { PaymentCompletedEvent } from "./events/PaymentCompletedEvent.ts";
import { BusinessRuleViolationError, ValidationError } from "../../../shared/errors/DomainError.ts";

export interface PaymentProps {
  orderId: string;
  amount: Money;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionReference?: string;
  failureReason?: string;
  refundedAmount?: Money;
  [key: string]: any;
}

export class Payment extends AggregateRoot<PaymentProps> {
  public constructor(props: PaymentProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get orderId(): string {
    return this.props.orderId;
  }

  get amount(): Money {
    return this.props.amount;
  }

  get method(): PaymentMethod {
    return this.props.method;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get transactionReference(): string | undefined {
    return this.props.transactionReference;
  }

  get failureReason(): string | undefined {
    return this.props.failureReason;
  }

  public static create(
    params: {
      orderId: string;
      amount: Money;
      method: PaymentMethod;
    },
    id?: string
  ): Payment {
    if (!params.orderId) {
      throw new ValidationError("Order ID is required to initialize payment.");
    }
    if (params.amount.amountInCents <= 0) {
      throw new ValidationError("Payment amount must be greater than zero.");
    }

    return new Payment(
      {
        orderId: params.orderId,
        amount: params.amount,
        method: params.method,
        status: PaymentStatus.PENDING,
      },
      id
    );
  }

  public static reconstitute(props: PaymentProps, id: string, createdAt: Date, updatedAt: Date): Payment {
    return new Payment(props, id, createdAt, updatedAt);
  }

  public markAsCaptured(transactionReference: string): void {
    if (this.props.status === PaymentStatus.CAPTURED) {
      throw new BusinessRuleViolationError("Payment is already captured.");
    }

    this.props.status = PaymentStatus.CAPTURED;
    this.props.transactionReference = transactionReference;
    this._updatedAt = new Date();

    this.addDomainEvent(
      new PaymentCompletedEvent(
        this.id,
        this.props.orderId,
        this.props.amount.amountInCents,
        this.props.amount.currency,
        transactionReference
      )
    );
  }

  public markAsFailed(reason: string): void {
    this.props.status = PaymentStatus.FAILED;
    this.props.failureReason = reason;
    this._updatedAt = new Date();
  }

  public refund(amount?: Money): void {
    if (this.props.status !== PaymentStatus.CAPTURED) {
      throw new BusinessRuleViolationError("Only captured payments can be refunded.");
    }

    const refundAmount = amount ?? this.props.amount;
    if (refundAmount.isGreaterThan(this.props.amount)) {
      throw new ValidationError("Refund amount cannot exceed captured amount.");
    }

    this.props.refundedAmount = refundAmount;
    this.props.status = PaymentStatus.REFUNDED;
    this._updatedAt = new Date();
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      orderId: this.orderId,
      amount: this.amount.amount,
      currency: this.amount.currency,
      method: this.method,
      status: this.status,
      transactionReference: this.transactionReference,
      failureReason: this.failureReason,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
