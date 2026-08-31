import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IOrderNoteRepository } from "../domain/IOrderNoteRepository.ts";
import { OrderNote } from "../domain/OrderNote.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface CancelOrderCommand {
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

export interface CancelOrderResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: CancelOrder
 * Coordinates business flow and state transformations for CancelOrder.
 */
export class CancelOrderUseCase implements IUseCase<CancelOrderCommand, CancelOrderResult> {
  constructor(
    private readonly repository: IOrderNoteRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CancelOrderCommand): Promise<CancelOrderResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for CancelOrder.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("OrderNote", command.id);
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
        message: "CancelOrder executed successfully on existing OrderNote.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`OrderNote with name '${command.name}' already exists.`);
      }
    }

    const newEntity = OrderNote.create({
      name: command.name ?? "OrderNote-Item",
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
      message: "CancelOrder created new OrderNote successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
