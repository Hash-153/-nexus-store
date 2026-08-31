import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IPriceDropSubscriptionRepository } from "../domain/IPriceDropSubscriptionRepository.ts";
import { PriceDropSubscription } from "../domain/PriceDropSubscription.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface TrackAbandonedCartCommand {
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

export interface TrackAbandonedCartResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: TrackAbandonedCart
 * Coordinates business flow and state transformations for TrackAbandonedCart.
 */
export class TrackAbandonedCartUseCase implements IUseCase<TrackAbandonedCartCommand, TrackAbandonedCartResult> {
  constructor(
    private readonly repository: IPriceDropSubscriptionRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: TrackAbandonedCartCommand): Promise<TrackAbandonedCartResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for TrackAbandonedCart.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("PriceDropSubscription", command.id);
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
        message: "TrackAbandonedCart executed successfully on existing PriceDropSubscription.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`PriceDropSubscription with name '${command.name}' already exists.`);
      }
    }

    const newEntity = PriceDropSubscription.create({
      name: command.name ?? "PriceDropSubscription-Item",
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
      message: "TrackAbandonedCart created new PriceDropSubscription successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
