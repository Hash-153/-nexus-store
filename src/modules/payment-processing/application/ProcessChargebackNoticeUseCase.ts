import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IPaymentMethodRecordRepository } from "../domain/IPaymentMethodRecordRepository.ts";
import { PaymentMethodRecord } from "../domain/PaymentMethodRecord.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ProcessChargebackNoticeCommand {
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

export interface ProcessChargebackNoticeResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ProcessChargebackNotice
 * Coordinates business flow and state transformations for ProcessChargebackNotice.
 */
export class ProcessChargebackNoticeUseCase implements IUseCase<ProcessChargebackNoticeCommand, ProcessChargebackNoticeResult> {
  constructor(
    private readonly repository: IPaymentMethodRecordRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ProcessChargebackNoticeCommand): Promise<ProcessChargebackNoticeResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ProcessChargebackNotice.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("PaymentMethodRecord", command.id);
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
        message: "ProcessChargebackNotice executed successfully on existing PaymentMethodRecord.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`PaymentMethodRecord with name '${command.name}' already exists.`);
      }
    }

    const newEntity = PaymentMethodRecord.create({
      name: command.name ?? "PaymentMethodRecord-Item",
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
      message: "ProcessChargebackNotice created new PaymentMethodRecord successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
