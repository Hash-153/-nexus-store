import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ITransferOrderRepository } from "../domain/ITransferOrderRepository.ts";
import { TransferOrder } from "../domain/TransferOrder.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GetLowStockAlertsCommand {
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

export interface GetLowStockAlertsResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GetLowStockAlerts
 * Coordinates business flow and state transformations for GetLowStockAlerts.
 */
export class GetLowStockAlertsUseCase implements IUseCase<GetLowStockAlertsCommand, GetLowStockAlertsResult> {
  constructor(
    private readonly repository: ITransferOrderRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GetLowStockAlertsCommand): Promise<GetLowStockAlertsResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GetLowStockAlerts.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("TransferOrder", command.id);
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
        message: "GetLowStockAlerts executed successfully on existing TransferOrder.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`TransferOrder with name '${command.name}' already exists.`);
      }
    }

    const newEntity = TransferOrder.create({
      name: command.name ?? "TransferOrder-Item",
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
      message: "GetLowStockAlerts created new TransferOrder successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
