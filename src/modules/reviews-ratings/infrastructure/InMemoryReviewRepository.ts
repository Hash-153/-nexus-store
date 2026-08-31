import { InMemoryRepository } from "../../../shared/infrastructure/Repository.ts";
import { Review } from "../domain/Review.ts";
import type { IReviewRepository } from "../domain/IReviewRepository.ts";

export class InMemoryReviewRepository extends InMemoryRepository<Review> implements IReviewRepository {
  public async findByProductId(productId: string): Promise<Review[]> {
    return Array.from(this.items.values()).filter(
      (r) => r.productId === productId && r.isApproved
    );
  }

  public async findByUserId(userId: string): Promise<Review[]> {
    return Array.from(this.items.values()).filter((r) => r.userId === userId);
  }

  public async getAverageRating(productId: string): Promise<{ average: number; count: number }> {
    const reviews = await this.findByProductId(productId);
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = Math.round((sum / reviews.length) * 10) / 10;
    return { average, count: reviews.length };
  }
}
