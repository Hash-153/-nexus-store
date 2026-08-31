import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IInventoryAdjustmentRepository } from "../domain/IInventoryAdjustmentRepository.ts";
import { InventoryAdjustment } from "../domain/InventoryAdjustment.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface AuditInventoryCommand {
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

export interface AuditInventoryResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: AuditInventory
 * Coordinates business flow and state transformations for AuditInventory.
 */
export class AuditInventoryUseCase implements IUseCase<AuditInventoryCommand, AuditInventoryResult> {
  constructor(
    private readonly repository: IInventoryAdjustmentRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: AuditInventoryCommand): Promise<AuditInventoryResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for AuditInventory.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("InventoryAdjustment", command.id);
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
        message: "AuditInventory executed successfully on existing InventoryAdjustment.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`InventoryAdjustment with name '${command.name}' already exists.`);
      }
    }

    const newEntity = InventoryAdjustment.create({
      name: command.name ?? "InventoryAdjustment-Item",
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
      message: "AuditInventory created new InventoryAdjustment successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
