import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IIpAccessLogRepository } from "../domain/IIpAccessLogRepository.ts";
import { IpAccessLog } from "../domain/IpAccessLog.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GetAuditTrailByEntityCommand {
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

export interface GetAuditTrailByEntityResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GetAuditTrailByEntity
 * Coordinates business flow and state transformations for GetAuditTrailByEntity.
 */
export class GetAuditTrailByEntityUseCase implements IUseCase<GetAuditTrailByEntityCommand, GetAuditTrailByEntityResult> {
  constructor(
    private readonly repository: IIpAccessLogRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GetAuditTrailByEntityCommand): Promise<GetAuditTrailByEntityResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GetAuditTrailByEntity.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("IpAccessLog", command.id);
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
        message: "GetAuditTrailByEntity executed successfully on existing IpAccessLog.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`IpAccessLog with name '${command.name}' already exists.`);
      }
    }

    const newEntity = IpAccessLog.create({
      name: command.name ?? "IpAccessLog-Item",
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
      message: "GetAuditTrailByEntity created new IpAccessLog successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
