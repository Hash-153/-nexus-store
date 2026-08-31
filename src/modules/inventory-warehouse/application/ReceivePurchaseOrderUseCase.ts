import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IRestockOrderRepository } from "../domain/IRestockOrderRepository.ts";
import { RestockOrder } from "../domain/RestockOrder.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ReceivePurchaseOrderCommand {
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

export interface ReceivePurchaseOrderResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ReceivePurchaseOrder
 * Coordinates business flow and state transformations for ReceivePurchaseOrder.
 */
export class ReceivePurchaseOrderUseCase implements IUseCase<ReceivePurchaseOrderCommand, ReceivePurchaseOrderResult> {
  constructor(
    private readonly repository: IRestockOrderRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ReceivePurchaseOrderCommand): Promise<ReceivePurchaseOrderResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ReceivePurchaseOrder.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("RestockOrder", command.id);
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
        message: "ReceivePurchaseOrder executed successfully on existing RestockOrder.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`RestockOrder with name '${command.name}' already exists.`);
      }
    }

    const newEntity = RestockOrder.create({
      name: command.name ?? "RestockOrder-Item",
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
      message: "ReceivePurchaseOrder created new RestockOrder successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
