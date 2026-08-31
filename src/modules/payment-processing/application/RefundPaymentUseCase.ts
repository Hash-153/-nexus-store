import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IChargebackRecordRepository } from "../domain/IChargebackRecordRepository.ts";
import { ChargebackRecord } from "../domain/ChargebackRecord.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface RefundPaymentCommand {
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

export interface RefundPaymentResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: RefundPayment
 * Coordinates business flow and state transformations for RefundPayment.
 */
export class RefundPaymentUseCase implements IUseCase<RefundPaymentCommand, RefundPaymentResult> {
  constructor(
    private readonly repository: IChargebackRecordRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: RefundPaymentCommand): Promise<RefundPaymentResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for RefundPayment.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ChargebackRecord", command.id);
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
        message: "RefundPayment executed successfully on existing ChargebackRecord.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ChargebackRecord with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ChargebackRecord.create({
      name: command.name ?? "ChargebackRecord-Item",
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
      message: "RefundPayment created new ChargebackRecord successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
