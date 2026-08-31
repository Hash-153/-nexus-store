import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Review } from "./Review.ts";

export interface IReviewRepository extends IRepository<Review> {
  findByProductId(productId: string): Promise<Review[]>;
  findByUserId(userId: string): Promise<Review[]>;
  getAverageRating(productId: string): Promise<{ average: number; count: number }>;
}
