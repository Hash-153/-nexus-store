import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IReviewModerationItemRepository } from "../domain/IReviewModerationItemRepository.ts";
import { ReviewModerationItem } from "../domain/ReviewModerationItem.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface PostProductQuestionCommand {
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

export interface PostProductQuestionResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: PostProductQuestion
 * Coordinates business flow and state transformations for PostProductQuestion.
 */
export class PostProductQuestionUseCase implements IUseCase<PostProductQuestionCommand, PostProductQuestionResult> {
  constructor(
    private readonly repository: IReviewModerationItemRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: PostProductQuestionCommand): Promise<PostProductQuestionResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for PostProductQuestion.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ReviewModerationItem", command.id);
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
        message: "PostProductQuestion executed successfully on existing ReviewModerationItem.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ReviewModerationItem with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ReviewModerationItem.create({
      name: command.name ?? "ReviewModerationItem-Item",
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
      message: "PostProductQuestion created new ReviewModerationItem successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
