import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IRefundTransactionRepository } from "../domain/IRefundTransactionRepository.ts";
import { RefundTransaction } from "../domain/RefundTransaction.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface CapturePaymentCommand {
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

export interface CapturePaymentResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: CapturePayment
 * Coordinates business flow and state transformations for CapturePayment.
 */
export class CapturePaymentUseCase implements IUseCase<CapturePaymentCommand, CapturePaymentResult> {
  constructor(
    private readonly repository: IRefundTransactionRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CapturePaymentCommand): Promise<CapturePaymentResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for CapturePayment.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("RefundTransaction", command.id);
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
        message: "CapturePayment executed successfully on existing RefundTransaction.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`RefundTransaction with name '${command.name}' already exists.`);
      }
    }

    const newEntity = RefundTransaction.create({
      name: command.name ?? "RefundTransaction-Item",
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
      message: "CapturePayment created new RefundTransaction successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
