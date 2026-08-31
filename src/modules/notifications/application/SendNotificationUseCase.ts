import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { INotificationTemplateRepository } from "../domain/INotificationTemplateRepository.ts";
import { NotificationTemplate } from "../domain/NotificationTemplate.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface SendNotificationCommand {
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

export interface SendNotificationResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: SendNotification
 * Coordinates business flow and state transformations for SendNotification.
 */
export class SendNotificationUseCase implements IUseCase<SendNotificationCommand, SendNotificationResult> {
  constructor(
    private readonly repository: INotificationTemplateRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: SendNotificationCommand): Promise<SendNotificationResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for SendNotification.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("NotificationTemplate", command.id);
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
        message: "SendNotification executed successfully on existing NotificationTemplate.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`NotificationTemplate with name '${command.name}' already exists.`);
      }
    }

    const newEntity = NotificationTemplate.create({
      name: command.name ?? "NotificationTemplate-Item",
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
      message: "SendNotification created new NotificationTemplate successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
