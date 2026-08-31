import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ICustomerFeedbackSurveyRepository } from "../domain/ICustomerFeedbackSurveyRepository.ts";
import { CustomerFeedbackSurvey } from "../domain/CustomerFeedbackSurvey.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ApplyCannedResponseCommand {
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

export interface ApplyCannedResponseResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ApplyCannedResponse
 * Coordinates business flow and state transformations for ApplyCannedResponse.
 */
export class ApplyCannedResponseUseCase implements IUseCase<ApplyCannedResponseCommand, ApplyCannedResponseResult> {
  constructor(
    private readonly repository: ICustomerFeedbackSurveyRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ApplyCannedResponseCommand): Promise<ApplyCannedResponseResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ApplyCannedResponse.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("CustomerFeedbackSurvey", command.id);
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
        message: "ApplyCannedResponse executed successfully on existing CustomerFeedbackSurvey.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`CustomerFeedbackSurvey with name '${command.name}' already exists.`);
      }
    }

    const newEntity = CustomerFeedbackSurvey.create({
      name: command.name ?? "CustomerFeedbackSurvey-Item",
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
      message: "ApplyCannedResponse created new CustomerFeedbackSurvey successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
