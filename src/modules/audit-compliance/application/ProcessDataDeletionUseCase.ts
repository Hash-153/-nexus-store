import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IDataDeletionRequestRepository } from "../domain/IDataDeletionRequestRepository.ts";
import { DataDeletionRequest } from "../domain/DataDeletionRequest.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ProcessDataDeletionCommand {
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

export interface ProcessDataDeletionResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ProcessDataDeletion
 * Coordinates business flow and state transformations for ProcessDataDeletion.
 */
export class ProcessDataDeletionUseCase implements IUseCase<ProcessDataDeletionCommand, ProcessDataDeletionResult> {
  constructor(
    private readonly repository: IDataDeletionRequestRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ProcessDataDeletionCommand): Promise<ProcessDataDeletionResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ProcessDataDeletion.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("DataDeletionRequest", command.id);
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
        message: "ProcessDataDeletion executed successfully on existing DataDeletionRequest.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`DataDeletionRequest with name '${command.name}' already exists.`);
      }
    }

    const newEntity = DataDeletionRequest.create({
      name: command.name ?? "DataDeletionRequest-Item",
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
      message: "ProcessDataDeletion created new DataDeletionRequest successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
