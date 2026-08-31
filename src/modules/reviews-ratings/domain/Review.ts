import { AggregateRoot } from "../../../shared/domain/AggregateRoot.ts";
import { ValidationError } from "../../../shared/errors/DomainError.ts";

export interface ReviewProps {
  productId: string;
  userId: string;
  rating: number;
  headline: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  [key: string]: any;
}

export class Review extends AggregateRoot<ReviewProps> {
  public constructor(props: ReviewProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get productId(): string {
    return this.props.productId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get rating(): number {
    return this.props.rating;
  }

  get headline(): string {
    return this.props.headline;
  }

  get comment(): string {
    return this.props.comment;
  }

  get isVerifiedPurchase(): boolean {
    return this.props.isVerifiedPurchase;
  }

  get isApproved(): boolean {
    return this.props.isApproved;
  }

  public static create(
    params: {
      productId: string;
      userId: string;
      rating: number;
      headline: string;
      comment: string;
      isVerifiedPurchase?: boolean;
    },
    id?: string
  ): Review {
    if (!params.productId) {
      throw new ValidationError("Product ID is required.");
    }
    if (!params.userId) {
      throw new ValidationError("User ID is required.");
    }
    if (!Number.isInteger(params.rating) || params.rating < 1 || params.rating > 5) {
      throw new ValidationError("Rating must be an integer between 1 and 5.");
    }
    if (!params.headline || params.headline.trim().length === 0) {
      throw new ValidationError("Review headline is required.");
    }
    if (!params.comment || params.comment.trim().length === 0) {
      throw new ValidationError("Review comment is required.");
    }

    return new Review(
      {
        productId: params.productId,
        userId: params.userId,
        rating: params.rating,
        headline: params.headline.trim(),
        comment: params.comment.trim(),
        isVerifiedPurchase: params.isVerifiedPurchase ?? false,
        isApproved: true,
      },
      id
    );
  }

  public approve(): void {
    this.props.isApproved = true;
    this._updatedAt = new Date();
  }

  public reject(): void {
    this.props.isApproved = false;
    this._updatedAt = new Date();
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      productId: this.productId,
      userId: this.userId,
      rating: this.rating,
      headline: this.headline,
      comment: this.comment,
      isVerifiedPurchase: this.isVerifiedPurchase,
      isApproved: this.isApproved,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
