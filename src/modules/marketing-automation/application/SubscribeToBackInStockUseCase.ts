import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ISegmentRuleRepository } from "../domain/ISegmentRuleRepository.ts";
import { SegmentRule } from "../domain/SegmentRule.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface SubscribeToBackInStockCommand {
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

export interface SubscribeToBackInStockResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: SubscribeToBackInStock
 * Coordinates business flow and state transformations for SubscribeToBackInStock.
 */
export class SubscribeToBackInStockUseCase implements IUseCase<SubscribeToBackInStockCommand, SubscribeToBackInStockResult> {
  constructor(
    private readonly repository: ISegmentRuleRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: SubscribeToBackInStockCommand): Promise<SubscribeToBackInStockResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for SubscribeToBackInStock.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("SegmentRule", command.id);
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
        message: "SubscribeToBackInStock executed successfully on existing SegmentRule.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`SegmentRule with name '${command.name}' already exists.`);
      }
    }

    const newEntity = SegmentRule.create({
      name: command.name ?? "SegmentRule-Item",
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
      message: "SubscribeToBackInStock created new SegmentRule successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
