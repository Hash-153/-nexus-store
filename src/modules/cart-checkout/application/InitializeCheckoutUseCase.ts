import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ISavedForLaterItemRepository } from "../domain/ISavedForLaterItemRepository.ts";
import { SavedForLaterItem } from "../domain/SavedForLaterItem.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface InitializeCheckoutCommand {
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

export interface InitializeCheckoutResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: InitializeCheckout
 * Coordinates business flow and state transformations for InitializeCheckout.
 */
export class InitializeCheckoutUseCase implements IUseCase<InitializeCheckoutCommand, InitializeCheckoutResult> {
  constructor(
    private readonly repository: ISavedForLaterItemRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: InitializeCheckoutCommand): Promise<InitializeCheckoutResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for InitializeCheckout.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("SavedForLaterItem", command.id);
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
        message: "InitializeCheckout executed successfully on existing SavedForLaterItem.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`SavedForLaterItem with name '${command.name}' already exists.`);
      }
    }

    const newEntity = SavedForLaterItem.create({
      name: command.name ?? "SavedForLaterItem-Item",
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
      message: "InitializeCheckout created new SavedForLaterItem successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
