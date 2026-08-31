import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IPurchaseOrderRepository } from "../domain/IPurchaseOrderRepository.ts";
import { PurchaseOrder } from "../domain/PurchaseOrder.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface CompleteTransferOrderCommand {
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

export interface CompleteTransferOrderResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: CompleteTransferOrder
 * Coordinates business flow and state transformations for CompleteTransferOrder.
 */
export class CompleteTransferOrderUseCase implements IUseCase<CompleteTransferOrderCommand, CompleteTransferOrderResult> {
  constructor(
    private readonly repository: IPurchaseOrderRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CompleteTransferOrderCommand): Promise<CompleteTransferOrderResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for CompleteTransferOrder.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("PurchaseOrder", command.id);
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
        message: "CompleteTransferOrder executed successfully on existing PurchaseOrder.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`PurchaseOrder with name '${command.name}' already exists.`);
      }
    }

    const newEntity = PurchaseOrder.create({
      name: command.name ?? "PurchaseOrder-Item",
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
      message: "CompleteTransferOrder created new PurchaseOrder successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
