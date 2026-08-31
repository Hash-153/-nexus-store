import { ValueObject } from "../ValueObject.ts";
import { ValidationError } from "../../errors/DomainError.ts";

export interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  private constructor(props: EmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(rawEmail: string): Email {
    if (!rawEmail || typeof rawEmail !== "string") {
      throw new ValidationError("Email address must be provided.");
    }
    const trimmed = rawEmail.trim().toLowerCase();
    if (!this.EMAIL_REGEX.test(trimmed)) {
      throw new ValidationError(`'${rawEmail}' is not a valid email address.`);
    }
    return new Email({ value: trimmed });
  }

  public toString(): string {
    return this.props.value;
  }
}
