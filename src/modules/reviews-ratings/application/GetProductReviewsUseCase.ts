import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ICustomerBadgeRepository } from "../domain/ICustomerBadgeRepository.ts";
import { CustomerBadge } from "../domain/CustomerBadge.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GetProductReviewsCommand {
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

export interface GetProductReviewsResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GetProductReviews
 * Coordinates business flow and state transformations for GetProductReviews.
 */
export class GetProductReviewsUseCase implements IUseCase<GetProductReviewsCommand, GetProductReviewsResult> {
  constructor(
    private readonly repository: ICustomerBadgeRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GetProductReviewsCommand): Promise<GetProductReviewsResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GetProductReviews.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("CustomerBadge", command.id);
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
        message: "GetProductReviews executed successfully on existing CustomerBadge.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`CustomerBadge with name '${command.name}' already exists.`);
      }
    }

    const newEntity = CustomerBadge.create({
      name: command.name ?? "CustomerBadge-Item",
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
      message: "GetProductReviews created new CustomerBadge successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
