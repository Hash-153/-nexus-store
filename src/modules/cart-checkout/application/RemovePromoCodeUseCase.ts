import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ICurrencyConversionRepository } from "../domain/ICurrencyConversionRepository.ts";
import { CurrencyConversion } from "../domain/CurrencyConversion.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface RemovePromoCodeCommand {
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

export interface RemovePromoCodeResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: RemovePromoCode
 * Coordinates business flow and state transformations for RemovePromoCode.
 */
export class RemovePromoCodeUseCase implements IUseCase<RemovePromoCodeCommand, RemovePromoCodeResult> {
  constructor(
    private readonly repository: ICurrencyConversionRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: RemovePromoCodeCommand): Promise<RemovePromoCodeResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for RemovePromoCode.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("CurrencyConversion", command.id);
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
        message: "RemovePromoCode executed successfully on existing CurrencyConversion.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`CurrencyConversion with name '${command.name}' already exists.`);
      }
    }

    const newEntity = CurrencyConversion.create({
      name: command.name ?? "CurrencyConversion-Item",
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
      message: "RemovePromoCode created new CurrencyConversion successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
