import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IFraudAssessmentRepository } from "../domain/IFraudAssessmentRepository.ts";
import { FraudAssessment } from "../domain/FraudAssessment.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface StorePaymentMethodTokenCommand {
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

export interface StorePaymentMethodTokenResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: StorePaymentMethodToken
 * Coordinates business flow and state transformations for StorePaymentMethodToken.
 */
export class StorePaymentMethodTokenUseCase implements IUseCase<StorePaymentMethodTokenCommand, StorePaymentMethodTokenResult> {
  constructor(
    private readonly repository: IFraudAssessmentRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: StorePaymentMethodTokenCommand): Promise<StorePaymentMethodTokenResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for StorePaymentMethodToken.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("FraudAssessment", command.id);
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
        message: "StorePaymentMethodToken executed successfully on existing FraudAssessment.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`FraudAssessment with name '${command.name}' already exists.`);
      }
    }

    const newEntity = FraudAssessment.create({
      name: command.name ?? "FraudAssessment-Item",
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
      message: "StorePaymentMethodToken created new FraudAssessment successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
