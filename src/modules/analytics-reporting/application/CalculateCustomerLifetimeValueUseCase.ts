import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IInventoryTurnoverRecordRepository } from "../domain/IInventoryTurnoverRecordRepository.ts";
import { InventoryTurnoverRecord } from "../domain/InventoryTurnoverRecord.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface CalculateCustomerLifetimeValueCommand {
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

export interface CalculateCustomerLifetimeValueResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: CalculateCustomerLifetimeValue
 * Coordinates business flow and state transformations for CalculateCustomerLifetimeValue.
 */
export class CalculateCustomerLifetimeValueUseCase implements IUseCase<CalculateCustomerLifetimeValueCommand, CalculateCustomerLifetimeValueResult> {
  constructor(
    private readonly repository: IInventoryTurnoverRecordRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CalculateCustomerLifetimeValueCommand): Promise<CalculateCustomerLifetimeValueResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for CalculateCustomerLifetimeValue.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("InventoryTurnoverRecord", command.id);
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
        message: "CalculateCustomerLifetimeValue executed successfully on existing InventoryTurnoverRecord.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`InventoryTurnoverRecord with name '${command.name}' already exists.`);
      }
    }

    const newEntity = InventoryTurnoverRecord.create({
      name: command.name ?? "InventoryTurnoverRecord-Item",
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
      message: "CalculateCustomerLifetimeValue created new InventoryTurnoverRecord successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
