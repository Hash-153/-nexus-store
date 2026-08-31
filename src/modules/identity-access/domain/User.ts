import { AggregateRoot } from "../../../shared/domain/AggregateRoot.ts";
import { Email } from "../../../shared/domain/value-objects/Email.ts";
import { UserRole, RolePermissions, type Permission } from "./UserRole.ts";
import { UserRegisteredEvent } from "./events/UserRegisteredEvent.ts";
import { ValidationError } from "../../../shared/errors/DomainError.ts";

export interface UserProps {
  email: Email;
  passwordHash: string;
  passwordSalt: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
  public constructor(props: UserProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get email(): Email {
    return this.props.email;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`.trim();
  }

  get role(): UserRole {
    return this.props.role;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get passwordSalt(): string {
    return this.props.passwordSalt;
  }

  get lastLoginAt(): Date | undefined {
    return this.props.lastLoginAt;
  }

  public static create(
    params: {
      email: Email;
      passwordHash: string;
      passwordSalt: string;
      firstName: string;
      lastName: string;
      role?: UserRole;
    },
    id?: string
  ): User {
    if (!params.firstName || params.firstName.trim().length === 0) {
      throw new ValidationError("First name is required.");
    }
    if (!params.lastName || params.lastName.trim().length === 0) {
      throw new ValidationError("Last name is required.");
    }

    const user = new User(
      {
        email: params.email,
        passwordHash: params.passwordHash,
        passwordSalt: params.passwordSalt,
        firstName: params.firstName.trim(),
        lastName: params.lastName.trim(),
        role: params.role ?? UserRole.CUSTOMER,
        isActive: true,
        isEmailVerified: false,
      },
      id
    );

    if (!id) {
      user.addDomainEvent(new UserRegisteredEvent(user.id, user.email.value, user.fullName));
    }

    return user;
  }

  public static reconstitute(props: UserProps, id: string, createdAt: Date, updatedAt: Date): User {
    return new User(props, id, createdAt, updatedAt);
  }

  public recordLogin(): void {
    this.props.lastLoginAt = new Date();
    this._updatedAt = new Date();
  }

  public verifyEmail(): void {
    this.props.isEmailVerified = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this.props.isActive = false;
    this._updatedAt = new Date();
  }

  public activate(): void {
    this.props.isActive = true;
    this._updatedAt = new Date();
  }

  public changeRole(newRole: UserRole): void {
    this.props.role = newRole;
    this._updatedAt = new Date();
  }

  public updatePassword(passwordHash: string, passwordSalt: string): void {
    this.props.passwordHash = passwordHash;
    this.props.passwordSalt = passwordSalt;
    this._updatedAt = new Date();
  }

  public hasPermission(resource: string, action: "read" | "write" | "delete" | "manage"): boolean {
    const permissions: Permission[] = RolePermissions[this.props.role] || [];
    return permissions.some(
      (p) => (p.resource === "*" || p.resource === resource) && (p.action === "manage" || p.action === action)
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      email: this.email.value,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      role: this.role,
      isActive: this.isActive,
      isEmailVerified: this.isEmailVerified,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
