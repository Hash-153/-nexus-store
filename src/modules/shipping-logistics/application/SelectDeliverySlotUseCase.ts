import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IShipmentRepository } from "../domain/IShipmentRepository.ts";
import { Shipment } from "../domain/Shipment.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface SelectDeliverySlotCommand {
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

export interface SelectDeliverySlotResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: SelectDeliverySlot
 * Coordinates business flow and state transformations for SelectDeliverySlot.
 */
export class SelectDeliverySlotUseCase implements IUseCase<SelectDeliverySlotCommand, SelectDeliverySlotResult> {
  constructor(
    private readonly repository: IShipmentRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: SelectDeliverySlotCommand): Promise<SelectDeliverySlotResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for SelectDeliverySlot.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("Shipment", command.id);
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
        message: "SelectDeliverySlot executed successfully on existing Shipment.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`Shipment with name '${command.name}' already exists.`);
      }
    }

    const newEntity = Shipment.create({
      name: command.name ?? "Shipment-Item",
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
      message: "SelectDeliverySlot created new Shipment successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
