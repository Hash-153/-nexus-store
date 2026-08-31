import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ICampaignRepository } from "../domain/ICampaignRepository.ts";
import { Campaign } from "../domain/Campaign.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GenerateProductRecommendationsCommand {
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

export interface GenerateProductRecommendationsResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GenerateProductRecommendations
 * Coordinates business flow and state transformations for GenerateProductRecommendations.
 */
export class GenerateProductRecommendationsUseCase implements IUseCase<GenerateProductRecommendationsCommand, GenerateProductRecommendationsResult> {
  constructor(
    private readonly repository: ICampaignRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GenerateProductRecommendationsCommand): Promise<GenerateProductRecommendationsResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GenerateProductRecommendations.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("Campaign", command.id);
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
        message: "GenerateProductRecommendations executed successfully on existing Campaign.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`Campaign with name '${command.name}' already exists.`);
      }
    }

    const newEntity = Campaign.create({
      name: command.name ?? "Campaign-Item",
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
      message: "GenerateProductRecommendations created new Campaign successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
