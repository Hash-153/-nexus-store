import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IApiKeyRepository } from "../domain/IApiKeyRepository.ts";
import { ApiKey } from "../domain/ApiKey.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ChangePasswordCommand {
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

export interface ChangePasswordResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ChangePassword
 * Coordinates business flow and state transformations for ChangePassword.
 */
export class ChangePasswordUseCase implements IUseCase<ChangePasswordCommand, ChangePasswordResult> {
  constructor(
    private readonly repository: IApiKeyRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ChangePasswordCommand): Promise<ChangePasswordResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ChangePassword.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ApiKey", command.id);
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
        message: "ChangePassword executed successfully on existing ApiKey.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ApiKey with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ApiKey.create({
      name: command.name ?? "ApiKey-Item",
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
      message: "ChangePassword created new ApiKey successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
