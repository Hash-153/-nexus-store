import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IDailySalesSnapshotRepository } from "../domain/IDailySalesSnapshotRepository.ts";
import { DailySalesSnapshot } from "../domain/DailySalesSnapshot.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GenerateDailySalesReportCommand {
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

export interface GenerateDailySalesReportResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GenerateDailySalesReport
 * Coordinates business flow and state transformations for GenerateDailySalesReport.
 */
export class GenerateDailySalesReportUseCase implements IUseCase<GenerateDailySalesReportCommand, GenerateDailySalesReportResult> {
  constructor(
    private readonly repository: IDailySalesSnapshotRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GenerateDailySalesReportCommand): Promise<GenerateDailySalesReportResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GenerateDailySalesReport.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("DailySalesSnapshot", command.id);
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
        message: "GenerateDailySalesReport executed successfully on existing DailySalesSnapshot.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`DailySalesSnapshot with name '${command.name}' already exists.`);
      }
    }

    const newEntity = DailySalesSnapshot.create({
      name: command.name ?? "DailySalesSnapshot-Item",
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
      message: "GenerateDailySalesReport created new DailySalesSnapshot successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
