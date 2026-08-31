import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IRoleRepository } from "../domain/IRoleRepository.ts";
import { Role } from "../domain/Role.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface RevokeApiKeyCommand {
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

export interface RevokeApiKeyResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: RevokeApiKey
 * Coordinates business flow and state transformations for RevokeApiKey.
 */
export class RevokeApiKeyUseCase implements IUseCase<RevokeApiKeyCommand, RevokeApiKeyResult> {
  constructor(
    private readonly repository: IRoleRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: RevokeApiKeyCommand): Promise<RevokeApiKeyResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for RevokeApiKey.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("Role", command.id);
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
        message: "RevokeApiKey executed successfully on existing Role.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`Role with name '${command.name}' already exists.`);
      }
    }

    const newEntity = Role.create({
      name: command.name ?? "Role-Item",
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
      message: "RevokeApiKey created new Role successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
