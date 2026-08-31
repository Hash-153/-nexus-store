import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IProductPerformanceRecordRepository } from "../domain/IProductPerformanceRecordRepository.ts";
import { ProductPerformanceRecord } from "../domain/ProductPerformanceRecord.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GenerateProductPerformanceReportCommand {
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

export interface GenerateProductPerformanceReportResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GenerateProductPerformanceReport
 * Coordinates business flow and state transformations for GenerateProductPerformanceReport.
 */
export class GenerateProductPerformanceReportUseCase implements IUseCase<GenerateProductPerformanceReportCommand, GenerateProductPerformanceReportResult> {
  constructor(
    private readonly repository: IProductPerformanceRecordRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GenerateProductPerformanceReportCommand): Promise<GenerateProductPerformanceReportResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GenerateProductPerformanceReport.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ProductPerformanceRecord", command.id);
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
        message: "GenerateProductPerformanceReport executed successfully on existing ProductPerformanceRecord.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ProductPerformanceRecord with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ProductPerformanceRecord.create({
      name: command.name ?? "ProductPerformanceRecord-Item",
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
      message: "GenerateProductPerformanceReport created new ProductPerformanceRecord successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
