import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IExchangeOrderRepository } from "../domain/IExchangeOrderRepository.ts";
import { ExchangeOrder } from "../domain/ExchangeOrder.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface RejectReturnCommand {
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

export interface RejectReturnResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: RejectReturn
 * Coordinates business flow and state transformations for RejectReturn.
 */
export class RejectReturnUseCase implements IUseCase<RejectReturnCommand, RejectReturnResult> {
  constructor(
    private readonly repository: IExchangeOrderRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: RejectReturnCommand): Promise<RejectReturnResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for RejectReturn.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ExchangeOrder", command.id);
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
        message: "RejectReturn executed successfully on existing ExchangeOrder.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ExchangeOrder with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ExchangeOrder.create({
      name: command.name ?? "ExchangeOrder-Item",
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
      message: "RejectReturn created new ExchangeOrder successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
