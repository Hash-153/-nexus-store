import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IMfaConfigRepository } from "../domain/IMfaConfigRepository.ts";
import { MfaConfig } from "../domain/MfaConfig.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ManageRolesCommand {
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

export interface ManageRolesResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ManageRoles
 * Coordinates business flow and state transformations for ManageRoles.
 */
export class ManageRolesUseCase implements IUseCase<ManageRolesCommand, ManageRolesResult> {
  constructor(
    private readonly repository: IMfaConfigRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ManageRolesCommand): Promise<ManageRolesResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ManageRoles.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("MfaConfig", command.id);
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
        message: "ManageRoles executed successfully on existing MfaConfig.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`MfaConfig with name '${command.name}' already exists.`);
      }
    }

    const newEntity = MfaConfig.create({
      name: command.name ?? "MfaConfig-Item",
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
      message: "ManageRoles created new MfaConfig successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
