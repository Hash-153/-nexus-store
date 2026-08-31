import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IPermissionRepository } from "../domain/IPermissionRepository.ts";
import { Permission } from "../domain/Permission.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GetUserAuditLogsCommand {
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

export interface GetUserAuditLogsResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GetUserAuditLogs
 * Coordinates business flow and state transformations for GetUserAuditLogs.
 */
export class GetUserAuditLogsUseCase implements IUseCase<GetUserAuditLogsCommand, GetUserAuditLogsResult> {
  constructor(
    private readonly repository: IPermissionRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GetUserAuditLogsCommand): Promise<GetUserAuditLogsResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GetUserAuditLogs.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("Permission", command.id);
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
        message: "GetUserAuditLogs executed successfully on existing Permission.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`Permission with name '${command.name}' already exists.`);
      }
    }

    const newEntity = Permission.create({
      name: command.name ?? "Permission-Item",
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
      message: "GetUserAuditLogs created new Permission successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
