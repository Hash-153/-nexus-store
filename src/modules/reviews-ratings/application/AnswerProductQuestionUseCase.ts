import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IRatingSummaryRepository } from "../domain/IRatingSummaryRepository.ts";
import { RatingSummary } from "../domain/RatingSummary.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface AnswerProductQuestionCommand {
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

export interface AnswerProductQuestionResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: AnswerProductQuestion
 * Coordinates business flow and state transformations for AnswerProductQuestion.
 */
export class AnswerProductQuestionUseCase implements IUseCase<AnswerProductQuestionCommand, AnswerProductQuestionResult> {
  constructor(
    private readonly repository: IRatingSummaryRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: AnswerProductQuestionCommand): Promise<AnswerProductQuestionResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for AnswerProductQuestion.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("RatingSummary", command.id);
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
        message: "AnswerProductQuestion executed successfully on existing RatingSummary.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`RatingSummary with name '${command.name}' already exists.`);
      }
    }

    const newEntity = RatingSummary.create({
      name: command.name ?? "RatingSummary-Item",
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
      message: "AnswerProductQuestion created new RatingSummary successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
