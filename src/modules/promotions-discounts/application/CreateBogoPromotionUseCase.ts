import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IFlashSaleRepository } from "../domain/IFlashSaleRepository.ts";
import { FlashSale } from "../domain/FlashSale.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface CreateBogoPromotionCommand {
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

export interface CreateBogoPromotionResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: CreateBogoPromotion
 * Coordinates business flow and state transformations for CreateBogoPromotion.
 */
export class CreateBogoPromotionUseCase implements IUseCase<CreateBogoPromotionCommand, CreateBogoPromotionResult> {
  constructor(
    private readonly repository: IFlashSaleRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CreateBogoPromotionCommand): Promise<CreateBogoPromotionResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for CreateBogoPromotion.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("FlashSale", command.id);
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
        message: "CreateBogoPromotion executed successfully on existing FlashSale.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`FlashSale with name '${command.name}' already exists.`);
      }
    }

    const newEntity = FlashSale.create({
      name: command.name ?? "FlashSale-Item",
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
      message: "CreateBogoPromotion created new FlashSale successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
