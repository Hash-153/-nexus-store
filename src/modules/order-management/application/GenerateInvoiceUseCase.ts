import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IOrderCancellationRepository } from "../domain/IOrderCancellationRepository.ts";
import { OrderCancellation } from "../domain/OrderCancellation.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GenerateInvoiceCommand {
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

export interface GenerateInvoiceResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GenerateInvoice
 * Coordinates business flow and state transformations for GenerateInvoice.
 */
export class GenerateInvoiceUseCase implements IUseCase<GenerateInvoiceCommand, GenerateInvoiceResult> {
  constructor(
    private readonly repository: IOrderCancellationRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GenerateInvoiceCommand): Promise<GenerateInvoiceResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GenerateInvoice.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("OrderCancellation", command.id);
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
        message: "GenerateInvoice executed successfully on existing OrderCancellation.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`OrderCancellation with name '${command.name}' already exists.`);
      }
    }

    const newEntity = OrderCancellation.create({
      name: command.name ?? "OrderCancellation-Item",
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
      message: "GenerateInvoice created new OrderCancellation successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
