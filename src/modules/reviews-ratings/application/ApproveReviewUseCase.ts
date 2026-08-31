import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IHelpfulVoteRepository } from "../domain/IHelpfulVoteRepository.ts";
import { HelpfulVote } from "../domain/HelpfulVote.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ApproveReviewCommand {
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

export interface ApproveReviewResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ApproveReview
 * Coordinates business flow and state transformations for ApproveReview.
 */
export class ApproveReviewUseCase implements IUseCase<ApproveReviewCommand, ApproveReviewResult> {
  constructor(
    private readonly repository: IHelpfulVoteRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ApproveReviewCommand): Promise<ApproveReviewResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ApproveReview.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("HelpfulVote", command.id);
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
        message: "ApproveReview executed successfully on existing HelpfulVote.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`HelpfulVote with name '${command.name}' already exists.`);
      }
    }

    const newEntity = HelpfulVote.create({
      name: command.name ?? "HelpfulVote-Item",
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
      message: "ApproveReview created new HelpfulVote successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
