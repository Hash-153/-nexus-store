import { AggregateRoot } from "../../../shared/domain/AggregateRoot.ts";
import { ProductVariant } from "./ProductVariant.ts";
import { ValidationError } from "../../../shared/errors/DomainError.ts";

export interface ProductProps {
  title: string;
  slug: string;
  description: string;
  categoryIds: string[];
  tags: string[];
  variants: ProductVariant[];
  isPublished: boolean;
  [key: string]: any;
}

export class Product extends AggregateRoot<ProductProps> {
  public constructor(props: ProductProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get title(): string {
    return this.props.title;
  }

  get slug(): string {
    return this.props.slug;
  }

  get description(): string {
    return this.props.description;
  }

  get categoryIds(): ReadonlyArray<string> {
    return [...this.props.categoryIds];
  }

  get tags(): ReadonlyArray<string> {
    return [...this.props.tags];
  }

  get variants(): ReadonlyArray<ProductVariant> {
    return [...this.props.variants];
  }

  get isPublished(): boolean {
    return this.props.isPublished;
  }

  public static create(
    params: {
      title: string;
      description: string;
      categoryIds: string[];
      tags?: string[];
      variants?: ProductVariant[];
    },
    id?: string
  ): Product {
    if (!params.title || params.title.trim().length === 0) {
      throw new ValidationError("Product title is required.");
    }
    if (!params.description || params.description.trim().length === 0) {
      throw new ValidationError("Product description is required.");
    }

    const slug = Product.generateSlug(params.title);

    return new Product(
      {
        title: params.title.trim(),
        slug,
        description: params.description.trim(),
        categoryIds: params.categoryIds,
        tags: params.tags ?? [],
        variants: params.variants ?? [],
        isPublished: false,
      },
      id
    );
  }

  public static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  public addVariant(variant: ProductVariant): void {
    const exists = this.props.variants.some((v) => v.sku.value === variant.sku.value);
    if (exists) {
      throw new ValidationError(`Variant with SKU '${variant.sku.value}' already exists on product.`);
    }
    this.props.variants.push(variant);
    this._updatedAt = new Date();
  }

  public removeVariant(variantId: string): void {
    this.props.variants = this.props.variants.filter((v) => v.id !== variantId);
    this._updatedAt = new Date();
  }

  public getVariantBySku(skuValue: string): ProductVariant | undefined {
    return this.props.variants.find((v) => v.sku.value === skuValue);
  }

  public publish(): void {
    if (this.props.variants.length === 0) {
      throw new ValidationError("Cannot publish a product without any variants.");
    }
    this.props.isPublished = true;
    this._updatedAt = new Date();
  }

  public unpublish(): void {
    this.props.isPublished = false;
    this._updatedAt = new Date();
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      description: this.description,
      categoryIds: [...this.categoryIds],
      tags: [...this.tags],
      variants: this.variants.map((v) => v.toJSON()),
      isPublished: this.isPublished,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
