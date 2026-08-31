import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IBackInStockSubscriptionRepository } from "../domain/IBackInStockSubscriptionRepository.ts";
import { BackInStockSubscription } from "../domain/BackInStockSubscription.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface SendAbandonedCartNotificationCommand {
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

export interface SendAbandonedCartNotificationResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: SendAbandonedCartNotification
 * Coordinates business flow and state transformations for SendAbandonedCartNotification.
 */
export class SendAbandonedCartNotificationUseCase implements IUseCase<SendAbandonedCartNotificationCommand, SendAbandonedCartNotificationResult> {
  constructor(
    private readonly repository: IBackInStockSubscriptionRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: SendAbandonedCartNotificationCommand): Promise<SendAbandonedCartNotificationResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for SendAbandonedCartNotification.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("BackInStockSubscription", command.id);
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
        message: "SendAbandonedCartNotification executed successfully on existing BackInStockSubscription.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`BackInStockSubscription with name '${command.name}' already exists.`);
      }
    }

    const newEntity = BackInStockSubscription.create({
      name: command.name ?? "BackInStockSubscription-Item",
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
      message: "SendAbandonedCartNotification created new BackInStockSubscription successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
