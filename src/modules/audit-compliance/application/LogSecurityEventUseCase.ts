import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ISecurityAlertRepository } from "../domain/ISecurityAlertRepository.ts";
import { SecurityAlert } from "../domain/SecurityAlert.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface LogSecurityEventCommand {
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

export interface LogSecurityEventResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: LogSecurityEvent
 * Coordinates business flow and state transformations for LogSecurityEvent.
 */
export class LogSecurityEventUseCase implements IUseCase<LogSecurityEventCommand, LogSecurityEventResult> {
  constructor(
    private readonly repository: ISecurityAlertRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: LogSecurityEventCommand): Promise<LogSecurityEventResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for LogSecurityEvent.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("SecurityAlert", command.id);
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
        message: "LogSecurityEvent executed successfully on existing SecurityAlert.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`SecurityAlert with name '${command.name}' already exists.`);
      }
    }

    const newEntity = SecurityAlert.create({
      name: command.name ?? "SecurityAlert-Item",
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
      message: "LogSecurityEvent created new SecurityAlert successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
