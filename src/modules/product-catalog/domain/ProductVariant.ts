import { Entity } from "../../../shared/domain/Entity.ts";
import { SKU } from "../../../shared/domain/value-objects/SKU.ts";
import { Money } from "../../../shared/domain/value-objects/Money.ts";
import { ValidationError } from "../../../shared/errors/DomainError.ts";

export interface ProductVariantProps {
  sku: SKU;
  name: string;
  price: Money;
  compareAtPrice?: Money;
  attributes: Record<string, string>;
  weightInGrams?: number;
  isActive: boolean;
  [key: string]: any;
}

export class ProductVariant extends Entity<ProductVariantProps> {
  public constructor(props: ProductVariantProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get sku(): SKU {
    return this.props.sku;
  }

  get name(): string {
    return this.props.name;
  }

  get price(): Money {
    return this.props.price;
  }

  get compareAtPrice(): Money | undefined {
    return this.props.compareAtPrice;
  }

  get attributes(): Record<string, string> {
    return { ...this.props.attributes };
  }

  get weightInGrams(): number | undefined {
    return this.props.weightInGrams;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  public static create(
    params: {
      sku: SKU;
      name: string;
      price: Money;
      compareAtPrice?: Money;
      attributes?: Record<string, string>;
      weightInGrams?: number;
    },
    id?: string
  ): ProductVariant {
    if (!params.name || params.name.trim().length === 0) {
      throw new ValidationError("Variant name is required.");
    }
    if (params.weightInGrams !== undefined && params.weightInGrams < 0) {
      throw new ValidationError("Weight cannot be negative.");
    }

    return new ProductVariant(
      {
        sku: params.sku,
        name: params.name.trim(),
        price: params.price,
        compareAtPrice: params.compareAtPrice,
        attributes: params.attributes ?? {},
        weightInGrams: params.weightInGrams,
        isActive: true,
      },
      id
    );
  }

  public updatePrice(price: Money, compareAtPrice?: Money): void {
    this.props.price = price;
    this.props.compareAtPrice = compareAtPrice;
    this._updatedAt = new Date();
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      sku: this.sku.value,
      name: this.name,
      price: this.price.amount,
      compareAtPrice: this.compareAtPrice?.amount,
      currency: this.price.currency,
      attributes: this.attributes,
      weightInGrams: this.weightInGrams,
      isActive: this.isActive,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
