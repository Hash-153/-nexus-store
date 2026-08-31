import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IPaymentTransactionRepository } from "../domain/IPaymentTransactionRepository.ts";
import { PaymentTransaction } from "../domain/PaymentTransaction.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface GetTransactionHistoryCommand {
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

export interface GetTransactionHistoryResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: GetTransactionHistory
 * Coordinates business flow and state transformations for GetTransactionHistory.
 */
export class GetTransactionHistoryUseCase implements IUseCase<GetTransactionHistoryCommand, GetTransactionHistoryResult> {
  constructor(
    private readonly repository: IPaymentTransactionRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GetTransactionHistoryCommand): Promise<GetTransactionHistoryResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for GetTransactionHistory.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("PaymentTransaction", command.id);
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
        message: "GetTransactionHistory executed successfully on existing PaymentTransaction.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`PaymentTransaction with name '${command.name}' already exists.`);
      }
    }

    const newEntity = PaymentTransaction.create({
      name: command.name ?? "PaymentTransaction-Item",
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
      message: "GetTransactionHistory created new PaymentTransaction successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
