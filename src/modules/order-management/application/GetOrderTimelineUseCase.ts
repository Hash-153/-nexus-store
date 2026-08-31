import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IOrderRepository } from "../domain/IOrderRepository.ts";
import { Order } from "../domain/Order.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GetOrderTimelineCommand {
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

export interface GetOrderTimelineResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GetOrderTimeline
 * Coordinates business flow and state transformations for GetOrderTimeline.
 */
export class GetOrderTimelineUseCase implements IUseCase<GetOrderTimelineCommand, GetOrderTimelineResult> {
  constructor(
    private readonly repository: IOrderRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GetOrderTimelineCommand): Promise<GetOrderTimelineResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GetOrderTimeline.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("Order", command.id);
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
        message: "GetOrderTimeline executed successfully on existing Order.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`Order with name '${command.name}' already exists.`);
      }
    }

    const newEntity = Order.create({
      name: command.name ?? "Order-Item",
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
      message: "GetOrderTimeline created new Order successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
