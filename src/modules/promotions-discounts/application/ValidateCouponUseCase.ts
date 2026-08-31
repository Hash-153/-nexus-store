import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IBogoRuleRepository } from "../domain/IBogoRuleRepository.ts";
import { BogoRule } from "../domain/BogoRule.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ValidateCouponCommand {
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

export interface ValidateCouponResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ValidateCoupon
 * Coordinates business flow and state transformations for ValidateCoupon.
 */
export class ValidateCouponUseCase implements IUseCase<ValidateCouponCommand, ValidateCouponResult> {
  constructor(
    private readonly repository: IBogoRuleRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ValidateCouponCommand): Promise<ValidateCouponResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ValidateCoupon.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("BogoRule", command.id);
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
        message: "ValidateCoupon executed successfully on existing BogoRule.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`BogoRule with name '${command.name}' already exists.`);
      }
    }

    const newEntity = BogoRule.create({
      name: command.name ?? "BogoRule-Item",
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
      message: "ValidateCoupon created new BogoRule successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
