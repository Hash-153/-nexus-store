import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IReviewRepository } from "../domain/IReviewRepository.ts";
import { Review } from "../domain/Review.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GetProductRatingBreakdownCommand {
  readonly id?: string;
  readonly name?: string;
  readonly code?: string;
  readonly title?: string;
  readonly description?: string;
  readonly status?: string;
  readonly priority?: number;
  readonly tags?: string[];
  readonly metadata?: Record<string, unknown>;
  readonly actorId?: string;
  [key: string]: any;
}

export interface GetProductRatingBreakdownResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GetProductRatingBreakdown
 * Coordinates business flow and state transformations for GetProductRatingBreakdown.
 */
export class GetProductRatingBreakdownUseCase implements IUseCase<GetProductRatingBreakdownCommand, GetProductRatingBreakdownResult> {
  constructor(
    private readonly repository: IReviewRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GetProductRatingBreakdownCommand): Promise<GetProductRatingBreakdownResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GetProductRatingBreakdown.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("Review", command.id);
      }

      existing.updateDetails({
        name: command.name,
        description: command.description,
        status: command.status,
        priority: command.priority,
        tags: command.tags,
        metadata: command.metadata,
      });

      await this.repository.save(existing);

      return {
        success: true,
        message: "GetProductRatingBreakdown executed successfully on existing Review.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`Review with name '${command.name}' already exists.`);
      }
    }

    const newEntity = Review.create({
      name: command.name ?? "Review-Item",
      code: command.code,
      title: command.title ?? command.name,
      description: command.description,
      status: command.status ?? "ACTIVE",
      priority: command.priority ?? 1,
      tags: command.tags ?? [],
      metadata: command.metadata ?? {},
    });

    await this.repository.save(newEntity);

    return {
      success: true,
      message: "GetProductRatingBreakdown created new Review successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
