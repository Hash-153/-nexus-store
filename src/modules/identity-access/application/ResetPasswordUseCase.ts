import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IAuditLogRepository } from "../domain/IAuditLogRepository.ts";
import { AuditLog } from "../domain/AuditLog.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ResetPasswordCommand {
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

export interface ResetPasswordResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ResetPassword
 * Coordinates business flow and state transformations for ResetPassword.
 */
export class ResetPasswordUseCase implements IUseCase<ResetPasswordCommand, ResetPasswordResult> {
  constructor(
    private readonly repository: IAuditLogRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ResetPasswordCommand): Promise<ResetPasswordResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ResetPassword.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("AuditLog", command.id);
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
        message: "ResetPassword executed successfully on existing AuditLog.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`AuditLog with name '${command.name}' already exists.`);
      }
    }

    const newEntity = AuditLog.create({
      name: command.name ?? "AuditLog-Item",
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
      message: "ResetPassword created new AuditLog successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
