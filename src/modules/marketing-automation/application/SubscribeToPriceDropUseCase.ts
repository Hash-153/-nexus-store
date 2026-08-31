import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IPersonalizedRecommendationRepository } from "../domain/IPersonalizedRecommendationRepository.ts";
import { PersonalizedRecommendation } from "../domain/PersonalizedRecommendation.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface SubscribeToPriceDropCommand {
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

export interface SubscribeToPriceDropResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: SubscribeToPriceDrop
 * Coordinates business flow and state transformations for SubscribeToPriceDrop.
 */
export class SubscribeToPriceDropUseCase implements IUseCase<SubscribeToPriceDropCommand, SubscribeToPriceDropResult> {
  constructor(
    private readonly repository: IPersonalizedRecommendationRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: SubscribeToPriceDropCommand): Promise<SubscribeToPriceDropResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for SubscribeToPriceDrop.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("PersonalizedRecommendation", command.id);
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
        message: "SubscribeToPriceDrop executed successfully on existing PersonalizedRecommendation.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`PersonalizedRecommendation with name '${command.name}' already exists.`);
      }
    }

    const newEntity = PersonalizedRecommendation.create({
      name: command.name ?? "PersonalizedRecommendation-Item",
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
      message: "SubscribeToPriceDrop created new PersonalizedRecommendation successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
