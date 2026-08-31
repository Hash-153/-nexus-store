import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ITieredDiscountRuleRepository } from "../domain/ITieredDiscountRuleRepository.ts";
import { TieredDiscountRule } from "../domain/TieredDiscountRule.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface DeactivateCouponCommand {
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

export interface DeactivateCouponResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: DeactivateCoupon
 * Coordinates business flow and state transformations for DeactivateCoupon.
 */
export class DeactivateCouponUseCase implements IUseCase<DeactivateCouponCommand, DeactivateCouponResult> {
  constructor(
    private readonly repository: ITieredDiscountRuleRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: DeactivateCouponCommand): Promise<DeactivateCouponResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for DeactivateCoupon.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("TieredDiscountRule", command.id);
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
        message: "DeactivateCoupon executed successfully on existing TieredDiscountRule.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`TieredDiscountRule with name '${command.name}' already exists.`);
      }
    }

    const newEntity = TieredDiscountRule.create({
      name: command.name ?? "TieredDiscountRule-Item",
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
      message: "DeactivateCoupon created new TieredDiscountRule successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
