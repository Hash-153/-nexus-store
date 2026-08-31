import { ValueObject } from "../ValueObject.ts";
import { ValidationError } from "../../errors/DomainError.ts";

export interface SKUProps {
  value: string;
}

export class SKU extends ValueObject<SKUProps> {
  private static readonly SKU_REGEX = /^[A-Z0-9_-]{3,30}$/;

  private constructor(props: SKUProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(rawSku: string): SKU {
    if (!rawSku || typeof rawSku !== "string") {
      throw new ValidationError("SKU cannot be empty.");
    }
    const formatted = rawSku.trim().toUpperCase();
    if (!this.SKU_REGEX.test(formatted)) {
      throw new ValidationError(`Invalid SKU format: '${rawSku}'. Must be 3-30 uppercase alphanumeric characters, dashes, or underscores.`);
    }
    return new SKU({ value: formatted });
  }

  public toString(): string {
    return this.props.value;
  }
}
