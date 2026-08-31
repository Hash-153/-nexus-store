import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IProfitMarginMetricRepository } from "../domain/IProfitMarginMetricRepository.ts";
import { ProfitMarginMetric } from "../domain/ProfitMarginMetric.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface AnalyzeInventoryTurnoverCommand {
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

export interface AnalyzeInventoryTurnoverResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: AnalyzeInventoryTurnover
 * Coordinates business flow and state transformations for AnalyzeInventoryTurnover.
 */
export class AnalyzeInventoryTurnoverUseCase implements IUseCase<AnalyzeInventoryTurnoverCommand, AnalyzeInventoryTurnoverResult> {
  constructor(
    private readonly repository: IProfitMarginMetricRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: AnalyzeInventoryTurnoverCommand): Promise<AnalyzeInventoryTurnoverResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for AnalyzeInventoryTurnover.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ProfitMarginMetric", command.id);
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
        message: "AnalyzeInventoryTurnover executed successfully on existing ProfitMarginMetric.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ProfitMarginMetric with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ProfitMarginMetric.create({
      name: command.name ?? "ProfitMarginMetric-Item",
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
      message: "AnalyzeInventoryTurnover created new ProfitMarginMetric successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
