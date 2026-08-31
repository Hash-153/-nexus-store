import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ITrafficSourceMetricRepository } from "../domain/ITrafficSourceMetricRepository.ts";
import { TrafficSourceMetric } from "../domain/TrafficSourceMetric.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ExportAnalyticsToCsvCommand {
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

export interface ExportAnalyticsToCsvResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ExportAnalyticsToCsv
 * Coordinates business flow and state transformations for ExportAnalyticsToCsv.
 */
export class ExportAnalyticsToCsvUseCase implements IUseCase<ExportAnalyticsToCsvCommand, ExportAnalyticsToCsvResult> {
  constructor(
    private readonly repository: ITrafficSourceMetricRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ExportAnalyticsToCsvCommand): Promise<ExportAnalyticsToCsvResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ExportAnalyticsToCsv.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("TrafficSourceMetric", command.id);
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
        message: "ExportAnalyticsToCsv executed successfully on existing TrafficSourceMetric.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`TrafficSourceMetric with name '${command.name}' already exists.`);
      }
    }

    const newEntity = TrafficSourceMetric.create({
      name: command.name ?? "TrafficSourceMetric-Item",
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
      message: "ExportAnalyticsToCsv created new TrafficSourceMetric successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
