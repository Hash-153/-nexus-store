import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IEmailSubscriberRepository } from "../domain/IEmailSubscriberRepository.ts";
import { EmailSubscriber } from "../domain/EmailSubscriber.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface SubscribeToNewsletterCommand {
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

export interface SubscribeToNewsletterResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: SubscribeToNewsletter
 * Coordinates business flow and state transformations for SubscribeToNewsletter.
 */
export class SubscribeToNewsletterUseCase implements IUseCase<SubscribeToNewsletterCommand, SubscribeToNewsletterResult> {
  constructor(
    private readonly repository: IEmailSubscriberRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: SubscribeToNewsletterCommand): Promise<SubscribeToNewsletterResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for SubscribeToNewsletter.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("EmailSubscriber", command.id);
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
        message: "SubscribeToNewsletter executed successfully on existing EmailSubscriber.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`EmailSubscriber with name '${command.name}' already exists.`);
      }
    }

    const newEntity = EmailSubscriber.create({
      name: command.name ?? "EmailSubscriber-Item",
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
      message: "SubscribeToNewsletter created new EmailSubscriber successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
