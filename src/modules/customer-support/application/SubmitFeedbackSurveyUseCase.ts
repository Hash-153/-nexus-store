import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ISupportAgentProfileRepository } from "../domain/ISupportAgentProfileRepository.ts";
import { SupportAgentProfile } from "../domain/SupportAgentProfile.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface SubmitFeedbackSurveyCommand {
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

export interface SubmitFeedbackSurveyResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: SubmitFeedbackSurvey
 * Coordinates business flow and state transformations for SubmitFeedbackSurvey.
 */
export class SubmitFeedbackSurveyUseCase implements IUseCase<SubmitFeedbackSurveyCommand, SubmitFeedbackSurveyResult> {
  constructor(
    private readonly repository: ISupportAgentProfileRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: SubmitFeedbackSurveyCommand): Promise<SubmitFeedbackSurveyResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for SubmitFeedbackSurvey.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("SupportAgentProfile", command.id);
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
        message: "SubmitFeedbackSurvey executed successfully on existing SupportAgentProfile.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`SupportAgentProfile with name '${command.name}' already exists.`);
      }
    }

    const newEntity = SupportAgentProfile.create({
      name: command.name ?? "SupportAgentProfile-Item",
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
      message: "SubmitFeedbackSurvey created new SupportAgentProfile successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
