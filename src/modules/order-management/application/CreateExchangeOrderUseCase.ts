import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IInvoiceRepository } from "../domain/IInvoiceRepository.ts";
import { Invoice } from "../domain/Invoice.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface CreateExchangeOrderCommand {
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

export interface CreateExchangeOrderResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: CreateExchangeOrder
 * Coordinates business flow and state transformations for CreateExchangeOrder.
 */
export class CreateExchangeOrderUseCase implements IUseCase<CreateExchangeOrderCommand, CreateExchangeOrderResult> {
  constructor(
    private readonly repository: IInvoiceRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CreateExchangeOrderCommand): Promise<CreateExchangeOrderResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for CreateExchangeOrder.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("Invoice", command.id);
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
        message: "CreateExchangeOrder executed successfully on existing Invoice.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`Invoice with name '${command.name}' already exists.`);
      }
    }

    const newEntity = Invoice.create({
      name: command.name ?? "Invoice-Item",
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
      message: "CreateExchangeOrder created new Invoice successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
