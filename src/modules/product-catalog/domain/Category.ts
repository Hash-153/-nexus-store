import { Entity } from "../../../shared/domain/Entity.ts";
import { ValidationError } from "../../../shared/errors/DomainError.ts";

export interface CategoryProps {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  isActive: boolean;
  [key: string]: any;
}

export class Category extends Entity<CategoryProps> {
  public constructor(props: CategoryProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get parentId(): string | null {
    return this.props.parentId ?? null;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  public static create(
    params: {
      name: string;
      description?: string;
      parentId?: string | null;
    },
    id?: string
  ): Category {
    if (!params.name || params.name.trim().length === 0) {
      throw new ValidationError("Category name is required.");
    }

    const slug = Category.generateSlug(params.name);

    return new Category(
      {
        name: params.name.trim(),
        slug,
        description: params.description?.trim(),
        parentId: params.parentId ?? null,
        isActive: true,
      },
      id
    );
  }

  public static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError("Category name cannot be empty.");
    }
    this.props.name = name.trim();
    this.props.slug = Category.generateSlug(name);
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

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      parentId: this.parentId,
      isActive: this.isActive,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
