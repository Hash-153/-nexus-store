import { ValueObject } from "../ValueObject.ts";
import { ValidationError } from "../../errors/DomainError.ts";

export interface AddressProps {
  street: string;
  unit?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  countryCode: string; // ISO 3166-1 alpha-2, e.g., 'US', 'CA', 'GB'
}

export class Address extends ValueObject<AddressProps> {
  private constructor(props: AddressProps) {
    super(props);
  }

  get street(): string {
    return this.props.street;
  }

  get unit(): string | undefined {
    return this.props.unit;
  }

  get city(): string {
    return this.props.city;
  }

  get stateOrProvince(): string {
    return this.props.stateOrProvince;
  }

  get postalCode(): string {
    return this.props.postalCode;
  }

  get countryCode(): string {
    return this.props.countryCode;
  }

  public static create(props: AddressProps): Address {
    if (!props.street || props.street.trim().length === 0) {
      throw new ValidationError("Street address is required.");
    }
    if (!props.city || props.city.trim().length === 0) {
      throw new ValidationError("City is required.");
    }
    if (!props.stateOrProvince || props.stateOrProvince.trim().length === 0) {
      throw new ValidationError("State or province is required.");
    }
    if (!props.postalCode || props.postalCode.trim().length === 0) {
      throw new ValidationError("Postal code is required.");
    }
    if (!props.countryCode || props.countryCode.trim().length !== 2) {
      throw new ValidationError("Country code must be a 2-letter ISO country code.");
    }

    return new Address({
      street: props.street.trim(),
      unit: props.unit ? props.unit.trim() : undefined,
      city: props.city.trim(),
      stateOrProvince: props.stateOrProvince.trim(),
      postalCode: props.postalCode.trim().toUpperCase(),
      countryCode: props.countryCode.trim().toUpperCase(),
    });
  }

  public format(): string {
    const unitPart = this.props.unit ? `, ${this.props.unit}` : "";
    return `${this.props.street}${unitPart}, ${this.props.city}, ${this.props.stateOrProvince} ${this.props.postalCode}, ${this.props.countryCode}`;
  }
}
