import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ICannedResponseRepository } from "../domain/ICannedResponseRepository.ts";
import { CannedResponse } from "../domain/CannedResponse.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface EscalateTicketCommand {
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

export interface EscalateTicketResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: EscalateTicket
 * Coordinates business flow and state transformations for EscalateTicket.
 */
export class EscalateTicketUseCase implements IUseCase<EscalateTicketCommand, EscalateTicketResult> {
  constructor(
    private readonly repository: ICannedResponseRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: EscalateTicketCommand): Promise<EscalateTicketResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for EscalateTicket.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("CannedResponse", command.id);
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
        message: "EscalateTicket executed successfully on existing CannedResponse.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`CannedResponse with name '${command.name}' already exists.`);
      }
    }

    const newEntity = CannedResponse.create({
      name: command.name ?? "CannedResponse-Item",
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
      message: "EscalateTicket created new CannedResponse successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
