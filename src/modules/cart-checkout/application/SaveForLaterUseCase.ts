import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ITaxBreakdownRepository } from "../domain/ITaxBreakdownRepository.ts";
import { TaxBreakdown } from "../domain/TaxBreakdown.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface SaveForLaterCommand {
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

export interface SaveForLaterResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: SaveForLater
 * Coordinates business flow and state transformations for SaveForLater.
 */
export class SaveForLaterUseCase implements IUseCase<SaveForLaterCommand, SaveForLaterResult> {
  constructor(
    private readonly repository: ITaxBreakdownRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: SaveForLaterCommand): Promise<SaveForLaterResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for SaveForLater.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("TaxBreakdown", command.id);
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
        message: "SaveForLater executed successfully on existing TaxBreakdown.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`TaxBreakdown with name '${command.name}' already exists.`);
      }
    }

    const newEntity = TaxBreakdown.create({
      name: command.name ?? "TaxBreakdown-Item",
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
      message: "SaveForLater created new TaxBreakdown successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
