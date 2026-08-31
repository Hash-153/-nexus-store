import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IRateTableRepository } from "../domain/IRateTableRepository.ts";
import { RateTable } from "../domain/RateTable.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface UpdateTrackingCheckpointCommand {
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

export interface UpdateTrackingCheckpointResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: UpdateTrackingCheckpoint
 * Coordinates business flow and state transformations for UpdateTrackingCheckpoint.
 */
export class UpdateTrackingCheckpointUseCase implements IUseCase<UpdateTrackingCheckpointCommand, UpdateTrackingCheckpointResult> {
  constructor(
    private readonly repository: IRateTableRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: UpdateTrackingCheckpointCommand): Promise<UpdateTrackingCheckpointResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for UpdateTrackingCheckpoint.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("RateTable", command.id);
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
        message: "UpdateTrackingCheckpoint executed successfully on existing RateTable.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`RateTable with name '${command.name}' already exists.`);
      }
    }

    const newEntity = RateTable.create({
      name: command.name ?? "RateTable-Item",
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
      message: "UpdateTrackingCheckpoint created new RateTable successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
