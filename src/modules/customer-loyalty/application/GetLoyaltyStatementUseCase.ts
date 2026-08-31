import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IMilestoneRewardRepository } from "../domain/IMilestoneRewardRepository.ts";
import { MilestoneReward } from "../domain/MilestoneReward.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GetLoyaltyStatementCommand {
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

export interface GetLoyaltyStatementResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GetLoyaltyStatement
 * Coordinates business flow and state transformations for GetLoyaltyStatement.
 */
export class GetLoyaltyStatementUseCase implements IUseCase<GetLoyaltyStatementCommand, GetLoyaltyStatementResult> {
  constructor(
    private readonly repository: IMilestoneRewardRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GetLoyaltyStatementCommand): Promise<GetLoyaltyStatementResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GetLoyaltyStatement.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("MilestoneReward", command.id);
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
        message: "GetLoyaltyStatement executed successfully on existing MilestoneReward.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`MilestoneReward with name '${command.name}' already exists.`);
      }
    }

    const newEntity = MilestoneReward.create({
      name: command.name ?? "MilestoneReward-Item",
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
      message: "GetLoyaltyStatement created new MilestoneReward successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
