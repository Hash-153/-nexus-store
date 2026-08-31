export abstract class DomainError extends Error {
  public readonly code: string;
  public readonly timestamp: Date;

  constructor(message: string, code: string = "DOMAIN_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends DomainError {
  public readonly errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(message, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class NotFoundError extends DomainError {
  constructor(entityName: string, entityId: string) {
    super(`${entityName} with id '${entityId}' was not found.`, "NOT_FOUND_ERROR");
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = "Unauthorized access.") {
    super(message, "UNAUTHORIZED_ERROR");
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = "Forbidden action.") {
    super(message, "FORBIDDEN_ERROR");
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, "CONFLICT_ERROR");
  }
}

export class BusinessRuleViolationError extends DomainError {
  constructor(message: string) {
    super(message, "BUSINESS_RULE_VIOLATION");
  }
}
