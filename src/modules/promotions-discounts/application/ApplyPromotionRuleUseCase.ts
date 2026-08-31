import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IBundleDiscountRepository } from "../domain/IBundleDiscountRepository.ts";
import { BundleDiscount } from "../domain/BundleDiscount.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ApplyPromotionRuleCommand {
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

export interface ApplyPromotionRuleResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ApplyPromotionRule
 * Coordinates business flow and state transformations for ApplyPromotionRule.
 */
export class ApplyPromotionRuleUseCase implements IUseCase<ApplyPromotionRuleCommand, ApplyPromotionRuleResult> {
  constructor(
    private readonly repository: IBundleDiscountRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ApplyPromotionRuleCommand): Promise<ApplyPromotionRuleResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ApplyPromotionRule.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("BundleDiscount", command.id);
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
        message: "ApplyPromotionRule executed successfully on existing BundleDiscount.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`BundleDiscount with name '${command.name}' already exists.`);
      }
    }

    const newEntity = BundleDiscount.create({
      name: command.name ?? "BundleDiscount-Item",
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
      message: "ApplyPromotionRule created new BundleDiscount successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
