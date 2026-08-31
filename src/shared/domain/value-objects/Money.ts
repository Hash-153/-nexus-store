import { ValueObject } from "../ValueObject.ts";
import { ValidationError } from "../../errors/DomainError.ts";

export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "INR";

export interface MoneyProps {
  amountInCents: number;
  currency: Currency;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  get amountInCents(): number {
    return this.props.amountInCents;
  }

  get amount(): number {
    return this.props.amountInCents / 100;
  }

  get currency(): Currency {
    return this.props.currency;
  }

  public static create(amount: number, currency: Currency = "USD"): Money {
    if (isNaN(amount) || amount < 0) {
      throw new ValidationError("Amount must be a non-negative number.");
    }
    const amountInCents = Math.round(amount * 100);
    return new Money({ amountInCents, currency });
  }

  public static fromCents(amountInCents: number, currency: Currency = "USD"): Money {
    if (!Number.isInteger(amountInCents) || amountInCents < 0) {
      throw new ValidationError("Amount in cents must be a non-negative integer.");
    }
    return new Money({ amountInCents, currency });
  }

  public static zero(currency: Currency = "USD"): Money {
    return new Money({ amountInCents: 0, currency });
  }

  public add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money({
      amountInCents: this.props.amountInCents + other.props.amountInCents,
      currency: this.props.currency,
    });
  }

  public subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    const newAmount = this.props.amountInCents - other.props.amountInCents;
    if (newAmount < 0) {
      throw new ValidationError("Resulting money amount cannot be negative.");
    }
    return new Money({
      amountInCents: newAmount,
      currency: this.props.currency,
    });
  }

  public multiply(factor: number): Money {
    if (factor < 0) {
      throw new ValidationError("Multiplier factor must be non-negative.");
    }
    return new Money({
      amountInCents: Math.round(this.props.amountInCents * factor),
      currency: this.props.currency,
    });
  }

  public isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.props.amountInCents > other.props.amountInCents;
  }

  public isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.props.amountInCents < other.props.amountInCents;
  }

  public format(): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: this.props.currency,
    }).format(this.amount);
  }

  private ensureSameCurrency(other: Money): void {
    if (this.props.currency !== other.props.currency) {
      throw new ValidationError(
        `Cannot operate on different currencies: '${this.props.currency}' and '${other.props.currency}'`
      );
    }
  }
}
