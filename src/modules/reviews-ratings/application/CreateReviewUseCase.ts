import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { CreateReviewDTO, ReviewResponseDTO } from "./dtos/ReviewDTOs.ts";
import type { IReviewRepository } from "../domain/IReviewRepository.ts";
import type { IProductRepository } from "../../product-catalog/domain/IProductRepository.ts";
import type { IOrderRepository } from "../../order-management/domain/IOrderRepository.ts";
import { Review } from "../domain/Review.ts";
import { NotFoundError } from "../../../shared/errors/DomainError.ts";
import { OrderStatus } from "../../order-management/domain/OrderStatus.ts";

export class CreateReviewUseCase implements IUseCase<CreateReviewDTO, ReviewResponseDTO> {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository
  ) {}

  public async execute(dto: CreateReviewDTO): Promise<ReviewResponseDTO> {
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new NotFoundError("Product", dto.productId);
    }

    // Check verified purchase badge
    const userOrders = await this.orderRepository.findByUserId(dto.userId);
    const hasPurchased = userOrders.some(
      (order) =>
        (order.status === OrderStatus.PAID ||
          order.status === OrderStatus.PROCESSING ||
          order.status === OrderStatus.SHIPPED ||
          order.status === OrderStatus.DELIVERED) &&
        order.items.some((item) => item.productId === dto.productId)
    );

    const review = Review.create({
      productId: dto.productId,
      userId: dto.userId,
      rating: dto.rating,
      headline: dto.headline,
      comment: dto.comment,
      isVerifiedPurchase: hasPurchased,
    });

    await this.reviewRepository.save(review);

    return {
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      headline: review.headline,
      comment: review.comment,
      isVerifiedPurchase: review.isVerifiedPurchase,
      isApproved: review.isApproved,
      createdAt: review.createdAt.toISOString(),
    };
  }
}
