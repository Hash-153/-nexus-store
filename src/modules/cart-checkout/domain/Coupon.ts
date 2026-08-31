import { Entity } from "../../../shared/domain/Entity.ts";
import { Money } from "../../../shared/domain/value-objects/Money.ts";
import { ValidationError } from "../../../shared/errors/DomainError.ts";

export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export interface CouponProps {
  code: string;
  discountType: DiscountType;
  discountValue: number; // e.g. 15 for 15% or 10.00 for $10 off
  minimumOrderAmount?: Money;
  maxDiscountAmount?: Money;
  expiresAt?: Date;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
}

export class Coupon extends Entity<CouponProps> {
  private constructor(props: CouponProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get code(): string {
    return this.props.code;
  }

  get discountType(): DiscountType {
    return this.props.discountType;
  }

  get discountValue(): number {
    return this.props.discountValue;
  }

  get minimumOrderAmount(): Money | undefined {
    return this.props.minimumOrderAmount;
  }

  get maxDiscountAmount(): Money | undefined {
    return this.props.maxDiscountAmount;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  public static create(
    params: {
      code: string;
      discountType: DiscountType;
      discountValue: number;
      minimumOrderAmount?: Money;
      maxDiscountAmount?: Money;
      expiresAt?: Date;
      usageLimit?: number;
    },
    id?: string
  ): Coupon {
    if (!params.code || params.code.trim().length === 0) {
      throw new ValidationError("Coupon code is required.");
    }
    if (params.discountValue <= 0) {
      throw new ValidationError("Discount value must be greater than zero.");
    }
    if (params.discountType === "PERCENTAGE" && params.discountValue > 100) {
      throw new ValidationError("Percentage discount cannot exceed 100%.");
    }

    return new Coupon(
      {
        code: params.code.trim().toUpperCase(),
        discountType: params.discountType,
        discountValue: params.discountValue,
        minimumOrderAmount: params.minimumOrderAmount,
        maxDiscountAmount: params.maxDiscountAmount,
        expiresAt: params.expiresAt,
        usageLimit: params.usageLimit,
        timesUsed: 0,
        isActive: true,
      },
      id
    );
  }

  public calculateDiscount(subtotal: Money): Money {
    this.validateEligibility(subtotal);

    if (this.props.discountType === "PERCENTAGE") {
      let discountAmount = subtotal.multiply(this.props.discountValue / 100);
      if (this.props.maxDiscountAmount && discountAmount.isGreaterThan(this.props.maxDiscountAmount)) {
        discountAmount = this.props.maxDiscountAmount;
      }
      return discountAmount;
    } else {
      const fixedDiscount = Money.create(this.props.discountValue, subtotal.currency);
      return fixedDiscount.isGreaterThan(subtotal) ? subtotal : fixedDiscount;
    }
  }

  public recordUsage(): void {
    this.props.timesUsed += 1;
    if (this.props.usageLimit && this.props.timesUsed >= this.props.usageLimit) {
      this.props.isActive = false;
    }
    this._updatedAt = new Date();
  }

  private validateEligibility(subtotal: Money): void {
    if (!this.props.isActive) {
      throw new ValidationError(`Coupon '${this.props.code}' is inactive or has reached its usage limit.`);
    }
    if (this.props.expiresAt && new Date() > this.props.expiresAt) {
      throw new ValidationError(`Coupon '${this.props.code}' has expired.`);
    }
    if (this.props.minimumOrderAmount && subtotal.isLessThan(this.props.minimumOrderAmount)) {
      throw new ValidationError(
        `Order subtotal must be at least ${this.props.minimumOrderAmount.format()} to use coupon '${this.props.code}'.`
      );
    }
  }
}
