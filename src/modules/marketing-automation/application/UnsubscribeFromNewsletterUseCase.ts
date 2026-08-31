import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IAbandonedCartRecordRepository } from "../domain/IAbandonedCartRecordRepository.ts";
import { AbandonedCartRecord } from "../domain/AbandonedCartRecord.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface UnsubscribeFromNewsletterCommand {
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

export interface UnsubscribeFromNewsletterResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: UnsubscribeFromNewsletter
 * Coordinates business flow and state transformations for UnsubscribeFromNewsletter.
 */
export class UnsubscribeFromNewsletterUseCase implements IUseCase<UnsubscribeFromNewsletterCommand, UnsubscribeFromNewsletterResult> {
  constructor(
    private readonly repository: IAbandonedCartRecordRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: UnsubscribeFromNewsletterCommand): Promise<UnsubscribeFromNewsletterResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for UnsubscribeFromNewsletter.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("AbandonedCartRecord", command.id);
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
        message: "UnsubscribeFromNewsletter executed successfully on existing AbandonedCartRecord.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`AbandonedCartRecord with name '${command.name}' already exists.`);
      }
    }

    const newEntity = AbandonedCartRecord.create({
      name: command.name ?? "AbandonedCartRecord-Item",
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
      message: "UnsubscribeFromNewsletter created new AbandonedCartRecord successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
