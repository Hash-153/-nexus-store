import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IAuditRecordRepository } from "../domain/IAuditRecordRepository.ts";
import { AuditRecord } from "../domain/AuditRecord.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface RecordAuditActionCommand {
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

export interface RecordAuditActionResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: RecordAuditAction
 * Coordinates business flow and state transformations for RecordAuditAction.
 */
export class RecordAuditActionUseCase implements IUseCase<RecordAuditActionCommand, RecordAuditActionResult> {
  constructor(
    private readonly repository: IAuditRecordRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: RecordAuditActionCommand): Promise<RecordAuditActionResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for RecordAuditAction.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("AuditRecord", command.id);
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
        message: "RecordAuditAction executed successfully on existing AuditRecord.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`AuditRecord with name '${command.name}' already exists.`);
      }
    }

    const newEntity = AuditRecord.create({
      name: command.name ?? "AuditRecord-Item",
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
      message: "RecordAuditAction created new AuditRecord successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
