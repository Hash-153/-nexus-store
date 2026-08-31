import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IStockMovementRepository } from "../domain/IStockMovementRepository.ts";
import { StockMovement } from "../domain/StockMovement.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ReleaseReservationCommand {
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

export interface ReleaseReservationResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ReleaseReservation
 * Coordinates business flow and state transformations for ReleaseReservation.
 */
export class ReleaseReservationUseCase implements IUseCase<ReleaseReservationCommand, ReleaseReservationResult> {
  constructor(
    private readonly repository: IStockMovementRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ReleaseReservationCommand): Promise<ReleaseReservationResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ReleaseReservation.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("StockMovement", command.id);
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
        message: "ReleaseReservation executed successfully on existing StockMovement.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`StockMovement with name '${command.name}' already exists.`);
      }
    }

    const newEntity = StockMovement.create({
      name: command.name ?? "StockMovement-Item",
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
      message: "ReleaseReservation created new StockMovement successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
