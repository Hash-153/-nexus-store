import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IEmailMessageRepository } from "../domain/IEmailMessageRepository.ts";
import { EmailMessage } from "../domain/EmailMessage.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface SendPushNotificationCommand {
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

export interface SendPushNotificationResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: SendPushNotification
 * Coordinates business flow and state transformations for SendPushNotification.
 */
export class SendPushNotificationUseCase implements IUseCase<SendPushNotificationCommand, SendPushNotificationResult> {
  constructor(
    private readonly repository: IEmailMessageRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: SendPushNotificationCommand): Promise<SendPushNotificationResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for SendPushNotification.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("EmailMessage", command.id);
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
        message: "SendPushNotification executed successfully on existing EmailMessage.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`EmailMessage with name '${command.name}' already exists.`);
      }
    }

    const newEntity = EmailMessage.create({
      name: command.name ?? "EmailMessage-Item",
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
      message: "SendPushNotification created new EmailMessage successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
