import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ISlaPolicyRepository } from "../domain/ISlaPolicyRepository.ts";
import { SlaPolicy } from "../domain/SlaPolicy.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ChangeTicketStatusCommand {
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

export interface ChangeTicketStatusResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ChangeTicketStatus
 * Coordinates business flow and state transformations for ChangeTicketStatus.
 */
export class ChangeTicketStatusUseCase implements IUseCase<ChangeTicketStatusCommand, ChangeTicketStatusResult> {
  constructor(
    private readonly repository: ISlaPolicyRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ChangeTicketStatusCommand): Promise<ChangeTicketStatusResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ChangeTicketStatus.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("SlaPolicy", command.id);
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
        message: "ChangeTicketStatus executed successfully on existing SlaPolicy.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`SlaPolicy with name '${command.name}' already exists.`);
      }
    }

    const newEntity = SlaPolicy.create({
      name: command.name ?? "SlaPolicy-Item",
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
      message: "ChangeTicketStatus created new SlaPolicy successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
