import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IRefundRateMetricRepository } from "../domain/IRefundRateMetricRepository.ts";
import { RefundRateMetric } from "../domain/RefundRateMetric.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GetFinancialSummaryReportCommand {
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

export interface GetFinancialSummaryReportResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GetFinancialSummaryReport
 * Coordinates business flow and state transformations for GetFinancialSummaryReport.
 */
export class GetFinancialSummaryReportUseCase implements IUseCase<GetFinancialSummaryReportCommand, GetFinancialSummaryReportResult> {
  constructor(
    private readonly repository: IRefundRateMetricRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GetFinancialSummaryReportCommand): Promise<GetFinancialSummaryReportResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GetFinancialSummaryReport.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("RefundRateMetric", command.id);
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
        message: "GetFinancialSummaryReport executed successfully on existing RefundRateMetric.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`RefundRateMetric with name '${command.name}' already exists.`);
      }
    }

    const newEntity = RefundRateMetric.create({
      name: command.name ?? "RefundRateMetric-Item",
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
      message: "GetFinancialSummaryReport created new RefundRateMetric successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
