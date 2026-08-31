import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ISmsMessageRepository } from "../domain/ISmsMessageRepository.ts";
import { SmsMessage } from "../domain/SmsMessage.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ManageNotificationPreferencesCommand {
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

export interface ManageNotificationPreferencesResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ManageNotificationPreferences
 * Coordinates business flow and state transformations for ManageNotificationPreferences.
 */
export class ManageNotificationPreferencesUseCase implements IUseCase<ManageNotificationPreferencesCommand, ManageNotificationPreferencesResult> {
  constructor(
    private readonly repository: ISmsMessageRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ManageNotificationPreferencesCommand): Promise<ManageNotificationPreferencesResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ManageNotificationPreferences.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("SmsMessage", command.id);
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
        message: "ManageNotificationPreferences executed successfully on existing SmsMessage.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`SmsMessage with name '${command.name}' already exists.`);
      }
    }

    const newEntity = SmsMessage.create({
      name: command.name ?? "SmsMessage-Item",
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
      message: "ManageNotificationPreferences created new SmsMessage successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
