import { Entity } from "../../../shared/domain/Entity.ts";
import { ValidationError, BusinessRuleViolationError } from "../../../shared/errors/DomainError.ts";

export interface SessionProps {
  readonly name?: string;
  readonly code?: string;
  readonly title?: string;
  readonly status?: string;
  readonly isEnabled?: boolean;
  readonly isActive?: boolean;
  readonly description?: string;
  readonly priority?: number;
  readonly metadata?: Record<string, unknown>;
  readonly tags?: string[];
  readonly version?: number;
  readonly notes?: string;
  readonly createdBy?: string;
  readonly updatedBy?: string;
  [key: string]: any;
}

/**
 * Domain Entity: Session
 * Encapsulates state and business invariants for Session within identity-access.
 */
export class Session extends Entity<SessionProps> {
  private _versionNumber: number = 1;

  public constructor(props: SessionProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
    this._versionNumber = props.version ?? 1;
    this.validateInvariants();
  }

  get name(): string | undefined {
    return this.props.name;
  }

  get code(): string | undefined {
    return this.props.code;
  }

  get title(): string | undefined {
    return this.props.title;
  }

  get status(): string {
    return this.props.status ?? "ACTIVE";
  }

  get isEnabled(): boolean {
    return this.props.isEnabled ?? true;
  }

  get isActive(): boolean {
    return this.props.isActive ?? true;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get priority(): number {
    return this.props.priority ?? 0;
  }

  get metadata(): Record<string, unknown> {
    return { ...(this.props.metadata ?? {}) };
  }

  get tags(): ReadonlyArray<string> {
    return [...(this.props.tags ?? [])];
  }

  get versionNumber(): number {
    return this._versionNumber;
  }

  public static create(props: SessionProps, id?: string): Session {
    if (props.name !== undefined && props.name.trim().length === 0) {
      throw new ValidationError("Session name cannot be empty.");
    }
    if (props.code !== undefined && props.code.trim().length === 0) {
      throw new ValidationError("Session code cannot be empty.");
    }

    return new Session(
      {
        ...props,
        status: props.status ?? "ACTIVE",
        isActive: props.isActive ?? true,
        isEnabled: props.isEnabled ?? true,
        tags: props.tags ?? [],
        metadata: props.metadata ?? {},
        version: 1,
      },
      id
    );
  }

  public static reconstitute(props: SessionProps, id: string, createdAt: Date, updatedAt: Date): Session {
    return new Session(props, id, createdAt, updatedAt);
  }

  public updateDetails(updates: Partial<SessionProps>): void {
    if (updates.name !== undefined && updates.name.trim().length === 0) {
      throw new ValidationError("Name cannot be updated to an empty value.");
    }
    Object.assign(this.props, updates);
    this._versionNumber += 1;
    this.props.version = this._versionNumber;
    this._updatedAt = new Date();
    this.validateInvariants();
  }

  public activate(): void {
    this.props.isActive = true;
    this.props.status = "ACTIVE";
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.props.status = "INACTIVE";
    this._updatedAt = new Date();
  }

  public addTag(tag: string): void {
    const trimmed = tag.trim().toLowerCase();
    if (!trimmed) {
      throw new ValidationError("Tag cannot be empty.");
    }
    if (!this.props.tags) {
      this.props.tags = [];
    }
    if (!this.props.tags.includes(trimmed)) {
      this.props.tags.push(trimmed);
      this._updatedAt = new Date();
    }
  }

  public removeTag(tag: string): void {
    const trimmed = tag.trim().toLowerCase();
    if (this.props.tags) {
      this.props.tags = this.props.tags.filter((t: string) => t !== trimmed);
      this._updatedAt = new Date();
    }
  }

  public setMetadata(key: string, value: unknown): void {
    if (!key || key.trim().length === 0) {
      throw new ValidationError("Metadata key cannot be blank.");
    }
    if (!this.props.metadata) {
      this.props.metadata = {};
    }
    this.props.metadata[key] = value;
    this._updatedAt = new Date();
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      ...this.props,
      versionNumber: this._versionNumber,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  private validateInvariants(): void {
    if (this.props.priority !== undefined && (isNaN(this.props.priority) || this.props.priority < 0)) {
      throw new BusinessRuleViolationError("Priority must be a non-negative integer.");
    }
  }
}
