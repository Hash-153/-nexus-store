import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IFunnelStageMetricRepository } from "../domain/IFunnelStageMetricRepository.ts";
import { FunnelStageMetric } from "../domain/FunnelStageMetric.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GenerateConversionFunnelReportCommand {
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

export interface GenerateConversionFunnelReportResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GenerateConversionFunnelReport
 * Coordinates business flow and state transformations for GenerateConversionFunnelReport.
 */
export class GenerateConversionFunnelReportUseCase implements IUseCase<GenerateConversionFunnelReportCommand, GenerateConversionFunnelReportResult> {
  constructor(
    private readonly repository: IFunnelStageMetricRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GenerateConversionFunnelReportCommand): Promise<GenerateConversionFunnelReportResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GenerateConversionFunnelReport.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("FunnelStageMetric", command.id);
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
        message: "GenerateConversionFunnelReport executed successfully on existing FunnelStageMetric.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`FunnelStageMetric with name '${command.name}' already exists.`);
      }
    }

    const newEntity = FunnelStageMetric.create({
      name: command.name ?? "FunnelStageMetric-Item",
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
      message: "GenerateConversionFunnelReport created new FunnelStageMetric successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
