import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IReviewMediaRepository } from "../domain/IReviewMediaRepository.ts";
import { ReviewMedia } from "../domain/ReviewMedia.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ReportAbusiveReviewCommand {
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

export interface ReportAbusiveReviewResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ReportAbusiveReview
 * Coordinates business flow and state transformations for ReportAbusiveReview.
 */
export class ReportAbusiveReviewUseCase implements IUseCase<ReportAbusiveReviewCommand, ReportAbusiveReviewResult> {
  constructor(
    private readonly repository: IReviewMediaRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ReportAbusiveReviewCommand): Promise<ReportAbusiveReviewResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ReportAbusiveReview.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ReviewMedia", command.id);
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
        message: "ReportAbusiveReview executed successfully on existing ReviewMedia.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ReviewMedia with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ReviewMedia.create({
      name: command.name ?? "ReviewMedia-Item",
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
      message: "ReportAbusiveReview created new ReviewMedia successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
