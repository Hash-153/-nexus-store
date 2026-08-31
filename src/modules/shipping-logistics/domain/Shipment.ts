import { AggregateRoot } from "../../../shared/domain/AggregateRoot.ts";
import { Address } from "../../../shared/domain/value-objects/Address.ts";
import { ValidationError } from "../../../shared/errors/DomainError.ts";

export enum ShipmentStatus {
  LABEL_CREATED = "LABEL_CREATED",
  IN_TRANSIT = "IN_TRANSIT",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
}

export interface ShipmentProps {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  shippingAddress: Address;
  status: ShipmentStatus;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  [key: string]: any;
}

export class Shipment extends AggregateRoot<ShipmentProps> {
  public constructor(props: ShipmentProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get orderId(): string {
    return this.props.orderId;
  }

  get carrier(): string {
    return this.props.carrier;
  }

  get trackingNumber(): string {
    return this.props.trackingNumber;
  }

  get shippingAddress(): Address {
    return this.props.shippingAddress;
  }

  get status(): ShipmentStatus {
    return this.props.status;
  }

  public static create(
    params: {
      orderId: string;
      carrier: string;
      trackingNumber: string;
      shippingAddress: Address;
      estimatedDeliveryDays?: number;
    },
    id?: string
  ): Shipment {
    if (!params.carrier || params.carrier.trim().length === 0) {
      throw new ValidationError("Carrier name is required.");
    }
    if (!params.trackingNumber || params.trackingNumber.trim().length === 0) {
      throw new ValidationError("Tracking number is required.");
    }

    const estimatedDeliveryDays = params.estimatedDeliveryDays ?? 3;
    const estimatedDeliveryDate = new Date(Date.now() + estimatedDeliveryDays * 24 * 60 * 60 * 1000);

    return new Shipment(
      {
        orderId: params.orderId,
        carrier: params.carrier.trim(),
        trackingNumber: params.trackingNumber.trim(),
        shippingAddress: params.shippingAddress,
        status: ShipmentStatus.LABEL_CREATED,
        estimatedDeliveryDate,
      },
      id
    );
  }

  public markInTransit(): void {
    this.props.status = ShipmentStatus.IN_TRANSIT;
    this._updatedAt = new Date();
  }

  public markOutForDelivery(): void {
    this.props.status = ShipmentStatus.OUT_FOR_DELIVERY;
    this._updatedAt = new Date();
  }

  public markDelivered(): void {
    this.props.status = ShipmentStatus.DELIVERED;
    this.props.actualDeliveryDate = new Date();
    this._updatedAt = new Date();
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      orderId: this.orderId,
      carrier: this.carrier,
      trackingNumber: this.trackingNumber,
      shippingAddress: this.shippingAddress.format(),
      status: this.status,
      estimatedDeliveryDate: this.props.estimatedDeliveryDate?.toISOString(),
      actualDeliveryDate: this.props.actualDeliveryDate?.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
