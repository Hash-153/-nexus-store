import { AggregateRoot } from "../../../shared/domain/AggregateRoot.ts";
import { SKU } from "../../../shared/domain/value-objects/SKU.ts";
import { Quantity } from "../../../shared/domain/value-objects/Quantity.ts";
import { LowStockDetectedEvent } from "./events/LowStockDetectedEvent.ts";
import { BusinessRuleViolationError, ValidationError } from "../../../shared/errors/DomainError.ts";

export interface InventoryItemProps {
  sku: SKU;
  warehouseLocation: string;
  availableQuantity: Quantity;
  reservedQuantity: Quantity;
  reorderThreshold: Quantity;
  [key: string]: any;
}

export class InventoryItem extends AggregateRoot<InventoryItemProps> {
  public constructor(props: InventoryItemProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get sku(): SKU {
    return this.props.sku;
  }

  get warehouseLocation(): string {
    return this.props.warehouseLocation;
  }

  get availableQuantity(): Quantity {
    return this.props.availableQuantity;
  }

  get reservedQuantity(): Quantity {
    return this.props.reservedQuantity;
  }

  get totalOnHand(): Quantity {
    return this.props.availableQuantity.add(this.props.reservedQuantity);
  }

  get reorderThreshold(): Quantity {
    return this.props.reorderThreshold;
  }

  public static create(
    params: {
      sku: SKU;
      warehouseLocation: string;
      initialQuantity: Quantity;
      reorderThreshold?: Quantity;
    },
    id?: string
  ): InventoryItem {
    if (!params.warehouseLocation || params.warehouseLocation.trim().length === 0) {
      throw new ValidationError("Warehouse location is required.");
    }

    const reorderThreshold = params.reorderThreshold ?? Quantity.create(5);

    const item = new InventoryItem(
      {
        sku: params.sku,
        warehouseLocation: params.warehouseLocation.trim(),
        availableQuantity: params.initialQuantity,
        reservedQuantity: Quantity.zero(),
        reorderThreshold,
      },
      id
    );

    item.checkLowStock();
    return item;
  }

  public static reconstitute(props: InventoryItemProps, id: string, createdAt: Date, updatedAt: Date): InventoryItem {
    return new InventoryItem(props, id, createdAt, updatedAt);
  }

  public restock(quantity: Quantity): void {
    this.props.availableQuantity = this.props.availableQuantity.add(quantity);
    this._updatedAt = new Date();
  }

  public reserve(quantity: Quantity): void {
    if (this.props.availableQuantity.isLessThan(quantity)) {
      throw new BusinessRuleViolationError(
        `Insufficient stock for SKU '${this.sku.value}'. Available: ${this.props.availableQuantity.value}, Requested: ${quantity.value}`
      );
    }

    this.props.availableQuantity = this.props.availableQuantity.subtract(quantity);
    this.props.reservedQuantity = this.props.reservedQuantity.add(quantity);
    this._updatedAt = new Date();

    this.checkLowStock();
  }

  public releaseReservation(quantity: Quantity): void {
    if (this.props.reservedQuantity.isLessThan(quantity)) {
      throw new BusinessRuleViolationError(
        `Cannot release more than reserved stock. Reserved: ${this.props.reservedQuantity.value}, Requested release: ${quantity.value}`
      );
    }

    this.props.reservedQuantity = this.props.reservedQuantity.subtract(quantity);
    this.props.availableQuantity = this.props.availableQuantity.add(quantity);
    this._updatedAt = new Date();
  }

  public fulfillReservation(quantity: Quantity): void {
    if (this.props.reservedQuantity.isLessThan(quantity)) {
      throw new BusinessRuleViolationError(
        `Cannot fulfill more than reserved stock. Reserved: ${this.props.reservedQuantity.value}, Requested fulfillment: ${quantity.value}`
      );
    }

    this.props.reservedQuantity = this.props.reservedQuantity.subtract(quantity);
    this._updatedAt = new Date();
  }

  private checkLowStock(): void {
    if (this.props.availableQuantity.isLessThan(this.props.reorderThreshold)) {
      this.addDomainEvent(
        new LowStockDetectedEvent(
          this.sku.value,
          this.props.availableQuantity.value,
          this.props.reorderThreshold.value
        )
      );
    }
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      sku: this.sku.value,
      warehouseLocation: this.warehouseLocation,
      availableQuantity: this.availableQuantity.value,
      reservedQuantity: this.reservedQuantity.value,
      totalOnHand: this.totalOnHand.value,
      reorderThreshold: this.reorderThreshold.value,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
