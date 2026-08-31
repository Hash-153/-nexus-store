import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IPushNotificationRepository } from "../domain/IPushNotificationRepository.ts";
import { PushNotification } from "../domain/PushNotification.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface CreateNotificationTemplateCommand {
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

export interface CreateNotificationTemplateResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: CreateNotificationTemplate
 * Coordinates business flow and state transformations for CreateNotificationTemplate.
 */
export class CreateNotificationTemplateUseCase implements IUseCase<CreateNotificationTemplateCommand, CreateNotificationTemplateResult> {
  constructor(
    private readonly repository: IPushNotificationRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CreateNotificationTemplateCommand): Promise<CreateNotificationTemplateResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for CreateNotificationTemplate.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("PushNotification", command.id);
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
        message: "CreateNotificationTemplate executed successfully on existing PushNotification.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`PushNotification with name '${command.name}' already exists.`);
      }
    }

    const newEntity = PushNotification.create({
      name: command.name ?? "PushNotification-Item",
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
      message: "CreateNotificationTemplate created new PushNotification successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
