import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IOrderTimelineEventRepository } from "../domain/IOrderTimelineEventRepository.ts";
import { OrderTimelineEvent } from "../domain/OrderTimelineEvent.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface CreateOrderFulfillmentCommand {
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

export interface CreateOrderFulfillmentResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: CreateOrderFulfillment
 * Coordinates business flow and state transformations for CreateOrderFulfillment.
 */
export class CreateOrderFulfillmentUseCase implements IUseCase<CreateOrderFulfillmentCommand, CreateOrderFulfillmentResult> {
  constructor(
    private readonly repository: IOrderTimelineEventRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CreateOrderFulfillmentCommand): Promise<CreateOrderFulfillmentResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for CreateOrderFulfillment.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("OrderTimelineEvent", command.id);
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
        message: "CreateOrderFulfillment executed successfully on existing OrderTimelineEvent.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`OrderTimelineEvent with name '${command.name}' already exists.`);
      }
    }

    const newEntity = OrderTimelineEvent.create({
      name: command.name ?? "OrderTimelineEvent-Item",
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
      message: "CreateOrderFulfillment created new OrderTimelineEvent successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
