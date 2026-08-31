import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IGatewayWebhookLogRepository } from "../domain/IGatewayWebhookLogRepository.ts";
import { GatewayWebhookLog } from "../domain/GatewayWebhookLog.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface DeletePaymentMethodTokenCommand {
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

export interface DeletePaymentMethodTokenResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: DeletePaymentMethodToken
 * Coordinates business flow and state transformations for DeletePaymentMethodToken.
 */
export class DeletePaymentMethodTokenUseCase implements IUseCase<DeletePaymentMethodTokenCommand, DeletePaymentMethodTokenResult> {
  constructor(
    private readonly repository: IGatewayWebhookLogRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: DeletePaymentMethodTokenCommand): Promise<DeletePaymentMethodTokenResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for DeletePaymentMethodToken.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("GatewayWebhookLog", command.id);
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
        message: "DeletePaymentMethodToken executed successfully on existing GatewayWebhookLog.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`GatewayWebhookLog with name '${command.name}' already exists.`);
      }
    }

    const newEntity = GatewayWebhookLog.create({
      name: command.name ?? "GatewayWebhookLog-Item",
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
      message: "DeletePaymentMethodToken created new GatewayWebhookLog successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
