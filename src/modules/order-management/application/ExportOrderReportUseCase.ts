import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IOrderItemRepository } from "../domain/IOrderItemRepository.ts";
import { OrderItem } from "../domain/OrderItem.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ExportOrderReportCommand {
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

export interface ExportOrderReportResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ExportOrderReport
 * Coordinates business flow and state transformations for ExportOrderReport.
 */
export class ExportOrderReportUseCase implements IUseCase<ExportOrderReportCommand, ExportOrderReportResult> {
  constructor(
    private readonly repository: IOrderItemRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ExportOrderReportCommand): Promise<ExportOrderReportResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ExportOrderReport.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("OrderItem", command.id);
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
        message: "ExportOrderReport executed successfully on existing OrderItem.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`OrderItem with name '${command.name}' already exists.`);
      }
    }

    const newEntity = OrderItem.create({
      name: command.name ?? "OrderItem-Item",
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
      message: "ExportOrderReport created new OrderItem successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
