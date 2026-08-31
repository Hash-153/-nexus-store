import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ICartItemRepository } from "../domain/ICartItemRepository.ts";
import { CartItem } from "../domain/CartItem.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface EstimateShippingRatesCommand {
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

export interface EstimateShippingRatesResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: EstimateShippingRates
 * Coordinates business flow and state transformations for EstimateShippingRates.
 */
export class EstimateShippingRatesUseCase implements IUseCase<EstimateShippingRatesCommand, EstimateShippingRatesResult> {
  constructor(
    private readonly repository: ICartItemRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: EstimateShippingRatesCommand): Promise<EstimateShippingRatesResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for EstimateShippingRates.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("CartItem", command.id);
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
        message: "EstimateShippingRates executed successfully on existing CartItem.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`CartItem with name '${command.name}' already exists.`);
      }
    }

    const newEntity = CartItem.create({
      name: command.name ?? "CartItem-Item",
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
      message: "EstimateShippingRates created new CartItem successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
