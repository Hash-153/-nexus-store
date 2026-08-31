import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IEscalationRuleRepository } from "../domain/IEscalationRuleRepository.ts";
import { EscalationRule } from "../domain/EscalationRule.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GetCustomerTicketsCommand {
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

export interface GetCustomerTicketsResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GetCustomerTickets
 * Coordinates business flow and state transformations for GetCustomerTickets.
 */
export class GetCustomerTicketsUseCase implements IUseCase<GetCustomerTicketsCommand, GetCustomerTicketsResult> {
  constructor(
    private readonly repository: IEscalationRuleRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GetCustomerTicketsCommand): Promise<GetCustomerTicketsResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GetCustomerTickets.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("EscalationRule", command.id);
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
        message: "GetCustomerTickets executed successfully on existing EscalationRule.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`EscalationRule with name '${command.name}' already exists.`);
      }
    }

    const newEntity = EscalationRule.create({
      name: command.name ?? "EscalationRule-Item",
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
      message: "GetCustomerTickets created new EscalationRule successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
