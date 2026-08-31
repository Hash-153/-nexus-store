import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IEscrowAccountRepository } from "../domain/IEscrowAccountRepository.ts";
import { EscrowAccount } from "../domain/EscrowAccount.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface HandlePaymentWebhookCommand {
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

export interface HandlePaymentWebhookResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: HandlePaymentWebhook
 * Coordinates business flow and state transformations for HandlePaymentWebhook.
 */
export class HandlePaymentWebhookUseCase implements IUseCase<HandlePaymentWebhookCommand, HandlePaymentWebhookResult> {
  constructor(
    private readonly repository: IEscrowAccountRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: HandlePaymentWebhookCommand): Promise<HandlePaymentWebhookResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for HandlePaymentWebhook.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("EscrowAccount", command.id);
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
        message: "HandlePaymentWebhook executed successfully on existing EscrowAccount.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`EscrowAccount with name '${command.name}' already exists.`);
      }
    }

    const newEntity = EscrowAccount.create({
      name: command.name ?? "EscrowAccount-Item",
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
      message: "HandlePaymentWebhook created new EscrowAccount successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
