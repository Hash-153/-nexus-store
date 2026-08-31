import { Entity } from "../../../shared/domain/Entity.ts";
import { SKU } from "../../../shared/domain/value-objects/SKU.ts";
import { Money } from "../../../shared/domain/value-objects/Money.ts";
import { Quantity } from "../../../shared/domain/value-objects/Quantity.ts";
import { ValidationError } from "../../../shared/errors/DomainError.ts";

export interface CartItemProps {
  productId: string;
  variantId: string;
  sku: SKU;
  title: string;
  variantName: string;
  unitPrice: Money;
  quantity: Quantity;
  [key: string]: any;
}

export class CartItem extends Entity<CartItemProps> {
  public constructor(props: CartItemProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get productId(): string {
    return this.props.productId;
  }

  get variantId(): string {
    return this.props.variantId;
  }

  get sku(): SKU {
    return this.props.sku;
  }

  get title(): string {
    return this.props.title;
  }

  get variantName(): string {
    return this.props.variantName;
  }

  get unitPrice(): Money {
    return this.props.unitPrice;
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }

  get lineTotal(): Money {
    return this.props.unitPrice.multiply(this.props.quantity.value);
  }

  public static create(
    params: {
      productId: string;
      variantId: string;
      sku: SKU;
      title: string;
      variantName: string;
      unitPrice: Money;
      quantity: Quantity;
    },
    id?: string
  ): CartItem {
    if (params.quantity.value <= 0) {
      throw new ValidationError("Cart item quantity must be at least 1.");
    }

    return new CartItem(
      {
        productId: params.productId,
        variantId: params.variantId,
        sku: params.sku,
        title: params.title,
        variantName: params.variantName,
        unitPrice: params.unitPrice,
        quantity: params.quantity,
      },
      id
    );
  }

  public updateQuantity(newQuantity: Quantity): void {
    if (newQuantity.value <= 0) {
      throw new ValidationError("Quantity must be greater than zero.");
    }
    this.props.quantity = newQuantity;
    this._updatedAt = new Date();
  }

  public addQuantity(quantityToAdd: Quantity): void {
    this.props.quantity = this.props.quantity.add(quantityToAdd);
    this._updatedAt = new Date();
  }
}
