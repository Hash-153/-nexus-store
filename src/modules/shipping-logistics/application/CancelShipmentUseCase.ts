import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ITrackingCheckpointRepository } from "../domain/ITrackingCheckpointRepository.ts";
import { TrackingCheckpoint } from "../domain/TrackingCheckpoint.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface CancelShipmentCommand {
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

export interface CancelShipmentResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: CancelShipment
 * Coordinates business flow and state transformations for CancelShipment.
 */
export class CancelShipmentUseCase implements IUseCase<CancelShipmentCommand, CancelShipmentResult> {
  constructor(
    private readonly repository: ITrackingCheckpointRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CancelShipmentCommand): Promise<CancelShipmentResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for CancelShipment.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("TrackingCheckpoint", command.id);
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
        message: "CancelShipment executed successfully on existing TrackingCheckpoint.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`TrackingCheckpoint with name '${command.name}' already exists.`);
      }
    }

    const newEntity = TrackingCheckpoint.create({
      name: command.name ?? "TrackingCheckpoint-Item",
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
      message: "CancelShipment created new TrackingCheckpoint successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
