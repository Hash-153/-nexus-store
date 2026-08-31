import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ICheckoutSessionRepository } from "../domain/ICheckoutSessionRepository.ts";
import { CheckoutSession } from "../domain/CheckoutSession.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ValidateCheckoutPreconditionsCommand {
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

export interface ValidateCheckoutPreconditionsResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ValidateCheckoutPreconditions
 * Coordinates business flow and state transformations for ValidateCheckoutPreconditions.
 */
export class ValidateCheckoutPreconditionsUseCase implements IUseCase<ValidateCheckoutPreconditionsCommand, ValidateCheckoutPreconditionsResult> {
  constructor(
    private readonly repository: ICheckoutSessionRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ValidateCheckoutPreconditionsCommand): Promise<ValidateCheckoutPreconditionsResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ValidateCheckoutPreconditions.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("CheckoutSession", command.id);
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
        message: "ValidateCheckoutPreconditions executed successfully on existing CheckoutSession.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`CheckoutSession with name '${command.name}' already exists.`);
      }
    }

    const newEntity = CheckoutSession.create({
      name: command.name ?? "CheckoutSession-Item",
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
      message: "ValidateCheckoutPreconditions created new CheckoutSession successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
