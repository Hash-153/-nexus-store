import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ICartDiscountRepository } from "../domain/ICartDiscountRepository.ts";
import { CartDiscount } from "../domain/CartDiscount.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ApplyPromoCodeCommand {
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

export interface ApplyPromoCodeResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ApplyPromoCode
 * Coordinates business flow and state transformations for ApplyPromoCode.
 */
export class ApplyPromoCodeUseCase implements IUseCase<ApplyPromoCodeCommand, ApplyPromoCodeResult> {
  constructor(
    private readonly repository: ICartDiscountRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ApplyPromoCodeCommand): Promise<ApplyPromoCodeResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ApplyPromoCode.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("CartDiscount", command.id);
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
        message: "ApplyPromoCode executed successfully on existing CartDiscount.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`CartDiscount with name '${command.name}' already exists.`);
      }
    }

    const newEntity = CartDiscount.create({
      name: command.name ?? "CartDiscount-Item",
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
      message: "ApplyPromoCode created new CartDiscount successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
