import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IUserPreferenceRepository } from "../domain/IUserPreferenceRepository.ts";
import { UserPreference } from "../domain/UserPreference.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface SendShippingUpdateSmsCommand {
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

export interface SendShippingUpdateSmsResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: SendShippingUpdateSms
 * Coordinates business flow and state transformations for SendShippingUpdateSms.
 */
export class SendShippingUpdateSmsUseCase implements IUseCase<SendShippingUpdateSmsCommand, SendShippingUpdateSmsResult> {
  constructor(
    private readonly repository: IUserPreferenceRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: SendShippingUpdateSmsCommand): Promise<SendShippingUpdateSmsResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for SendShippingUpdateSms.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("UserPreference", command.id);
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
        message: "SendShippingUpdateSms executed successfully on existing UserPreference.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`UserPreference with name '${command.name}' already exists.`);
      }
    }

    const newEntity = UserPreference.create({
      name: command.name ?? "UserPreference-Item",
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
      message: "SendShippingUpdateSms created new UserPreference successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
