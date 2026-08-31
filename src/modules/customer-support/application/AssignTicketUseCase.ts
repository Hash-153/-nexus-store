import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ITicketAttachmentRepository } from "../domain/ITicketAttachmentRepository.ts";
import { TicketAttachment } from "../domain/TicketAttachment.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface AssignTicketCommand {
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

export interface AssignTicketResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: AssignTicket
 * Coordinates business flow and state transformations for AssignTicket.
 */
export class AssignTicketUseCase implements IUseCase<AssignTicketCommand, AssignTicketResult> {
  constructor(
    private readonly repository: ITicketAttachmentRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: AssignTicketCommand): Promise<AssignTicketResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for AssignTicket.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("TicketAttachment", command.id);
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
        message: "AssignTicket executed successfully on existing TicketAttachment.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`TicketAttachment with name '${command.name}' already exists.`);
      }
    }

    const newEntity = TicketAttachment.create({
      name: command.name ?? "TicketAttachment-Item",
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
      message: "AssignTicket created new TicketAttachment successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
