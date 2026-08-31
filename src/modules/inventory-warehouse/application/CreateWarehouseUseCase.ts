import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IWarehouseRepository } from "../domain/IWarehouseRepository.ts";
import { Warehouse } from "../domain/Warehouse.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface CreateWarehouseCommand {
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

export interface CreateWarehouseResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: CreateWarehouse
 * Coordinates business flow and state transformations for CreateWarehouse.
 */
export class CreateWarehouseUseCase implements IUseCase<CreateWarehouseCommand, CreateWarehouseResult> {
  constructor(
    private readonly repository: IWarehouseRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CreateWarehouseCommand): Promise<CreateWarehouseResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for CreateWarehouse.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("Warehouse", command.id);
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
        message: "CreateWarehouse executed successfully on existing Warehouse.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`Warehouse with name '${command.name}' already exists.`);
      }
    }

    const newEntity = Warehouse.create({
      name: command.name ?? "Warehouse-Item",
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
      message: "CreateWarehouse created new Warehouse successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
