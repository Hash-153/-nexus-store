import { ValueObject } from "../ValueObject.ts";
import { ValidationError } from "../../errors/DomainError.ts";

export interface QuantityProps {
  value: number;
}

export class Quantity extends ValueObject<QuantityProps> {
  private constructor(props: QuantityProps) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  public static create(value: number): Quantity {
    if (!Number.isInteger(value) || value < 0) {
      throw new ValidationError("Quantity must be a non-negative integer.");
    }
    return new Quantity({ value });
  }

  public static zero(): Quantity {
    return new Quantity({ value: 0 });
  }

  public add(other: Quantity): Quantity {
    return new Quantity({ value: this.props.value + other.props.value });
  }

  public subtract(other: Quantity): Quantity {
    const diff = this.props.value - other.props.value;
    if (diff < 0) {
      throw new ValidationError("Quantity cannot be negative.");
    }
    return new Quantity({ value: diff });
  }

  public isGreaterThanOrEqual(other: Quantity): boolean {
    return this.props.value >= other.props.value;
  }

  public isLessThan(other: Quantity): boolean {
    return this.props.value < other.props.value;
  }
}
