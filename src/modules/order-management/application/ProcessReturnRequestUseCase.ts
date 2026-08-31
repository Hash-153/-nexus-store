import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IReturnRequestRepository } from "../domain/IReturnRequestRepository.ts";
import { ReturnRequest } from "../domain/ReturnRequest.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ProcessReturnRequestCommand {
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

export interface ProcessReturnRequestResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ProcessReturnRequest
 * Coordinates business flow and state transformations for ProcessReturnRequest.
 */
export class ProcessReturnRequestUseCase implements IUseCase<ProcessReturnRequestCommand, ProcessReturnRequestResult> {
  constructor(
    private readonly repository: IReturnRequestRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ProcessReturnRequestCommand): Promise<ProcessReturnRequestResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ProcessReturnRequest.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ReturnRequest", command.id);
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
        message: "ProcessReturnRequest executed successfully on existing ReturnRequest.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ReturnRequest with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ReturnRequest.create({
      name: command.name ?? "ReturnRequest-Item",
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
      message: "ProcessReturnRequest created new ReturnRequest successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
