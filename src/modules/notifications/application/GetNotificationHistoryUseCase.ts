import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IWebhookNotificationRepository } from "../domain/IWebhookNotificationRepository.ts";
import { WebhookNotification } from "../domain/WebhookNotification.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GetNotificationHistoryCommand {
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

export interface GetNotificationHistoryResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GetNotificationHistory
 * Coordinates business flow and state transformations for GetNotificationHistory.
 */
export class GetNotificationHistoryUseCase implements IUseCase<GetNotificationHistoryCommand, GetNotificationHistoryResult> {
  constructor(
    private readonly repository: IWebhookNotificationRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GetNotificationHistoryCommand): Promise<GetNotificationHistoryResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GetNotificationHistory.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("WebhookNotification", command.id);
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
        message: "GetNotificationHistory executed successfully on existing WebhookNotification.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`WebhookNotification with name '${command.name}' already exists.`);
      }
    }

    const newEntity = WebhookNotification.create({
      name: command.name ?? "WebhookNotification-Item",
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
      message: "GetNotificationHistory created new WebhookNotification successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
