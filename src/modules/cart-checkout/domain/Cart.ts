import { AggregateRoot } from "../../../shared/domain/AggregateRoot.ts";
import { CartItem } from "./CartItem.ts";
import { Coupon } from "./Coupon.ts";
import { Money, type Currency } from "../../../shared/domain/value-objects/Money.ts";
import { Quantity } from "../../../shared/domain/value-objects/Quantity.ts";
import { ValidationError } from "../../../shared/errors/DomainError.ts";

export interface CartProps {
  userId?: string | null;
  items: CartItem[];
  appliedCoupon?: Coupon | null;
  currency: Currency;
  [key: string]: any;
}

export class Cart extends AggregateRoot<CartProps> {
  public constructor(props: CartProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get userId(): string | null {
    return this.props.userId ?? null;
  }

  get items(): ReadonlyArray<CartItem> {
    return [...this.props.items];
  }

  get appliedCoupon(): Coupon | null {
    return this.props.appliedCoupon ?? null;
  }

  get currency(): Currency {
    return this.props.currency;
  }

  get subtotal(): Money {
    if (this.props.items.length === 0) {
      return Money.zero(this.props.currency);
    }
    return this.props.items.reduce(
      (acc, item) => acc.add(item.lineTotal),
      Money.zero(this.props.currency)
    );
  }

  get discountTotal(): Money {
    if (!this.props.appliedCoupon || this.props.items.length === 0) {
      return Money.zero(this.props.currency);
    }
    return this.props.appliedCoupon.calculateDiscount(this.subtotal);
  }

  get total(): Money {
    const sub = this.subtotal;
    const disc = this.discountTotal;
    return sub.isGreaterThan(disc) ? sub.subtract(disc) : Money.zero(this.props.currency);
  }

  get totalItemsCount(): number {
    return this.props.items.reduce((acc, item) => acc + item.quantity.value, 0);
  }

  public static create(
    params: {
      userId?: string | null;
      currency?: Currency;
    },
    id?: string
  ): Cart {
    return new Cart(
      {
        userId: params.userId ?? null,
        items: [],
        appliedCoupon: null,
        currency: params.currency ?? "USD",
      },
      id
    );
  }

  public addItem(item: CartItem): void {
    if (item.unitPrice.currency !== this.props.currency) {
      throw new ValidationError(
        `Item currency '${item.unitPrice.currency}' does not match cart currency '${this.props.currency}'.`
      );
    }

    const existingIndex = this.props.items.findIndex((i) => i.sku.value === item.sku.value);
    if (existingIndex >= 0) {
      this.props.items[existingIndex].addQuantity(item.quantity);
    } else {
      this.props.items.push(item);
    }
    this._updatedAt = new Date();
  }

  public updateItemQuantity(skuValue: string, newQuantity: Quantity): void {
    const item = this.props.items.find((i) => i.sku.value === skuValue);
    if (!item) {
      throw new ValidationError(`Item with SKU '${skuValue}' not found in cart.`);
    }

    if (newQuantity.value === 0) {
      this.removeItem(skuValue);
    } else {
      item.updateQuantity(newQuantity);
      this._updatedAt = new Date();
    }
  }

  public removeItem(skuValue: string): void {
    this.props.items = this.props.items.filter((i) => i.sku.value !== skuValue);
    this._updatedAt = new Date();
  }

  public applyCoupon(coupon: Coupon): void {
    coupon.calculateDiscount(this.subtotal);
    this.props.appliedCoupon = coupon;
    this._updatedAt = new Date();
  }

  public removeCoupon(): void {
    this.props.appliedCoupon = null;
    this._updatedAt = new Date();
  }

  public clear(): void {
    this.props.items = [];
    this.props.appliedCoupon = null;
    this._updatedAt = new Date();
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
      totalItemsCount: this.totalItemsCount,
      subtotal: this.subtotal.amount,
      discountTotal: this.discountTotal.amount,
      total: this.total.amount,
      appliedCouponCode: this.appliedCoupon?.code ?? null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
