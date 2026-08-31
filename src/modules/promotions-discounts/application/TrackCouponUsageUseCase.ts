import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IPromotionRuleRepository } from "../domain/IPromotionRuleRepository.ts";
import { PromotionRule } from "../domain/PromotionRule.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface TrackCouponUsageCommand {
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

export interface TrackCouponUsageResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: TrackCouponUsage
 * Coordinates business flow and state transformations for TrackCouponUsage.
 */
export class TrackCouponUsageUseCase implements IUseCase<TrackCouponUsageCommand, TrackCouponUsageResult> {
  constructor(
    private readonly repository: IPromotionRuleRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: TrackCouponUsageCommand): Promise<TrackCouponUsageResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for TrackCouponUsage.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("PromotionRule", command.id);
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
        message: "TrackCouponUsage executed successfully on existing PromotionRule.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`PromotionRule with name '${command.name}' already exists.`);
      }
    }

    const newEntity = PromotionRule.create({
      name: command.name ?? "PromotionRule-Item",
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
      message: "TrackCouponUsage created new PromotionRule successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
