import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IEmailSubscriberRepository } from "../domain/IEmailSubscriberRepository.ts";
import { EmailSubscriber } from "../domain/EmailSubscriber.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface SegmentCustomersCommand {
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

export interface SegmentCustomersResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: SegmentCustomers
 * Coordinates business flow and state transformations for SegmentCustomers.
 */
export class SegmentCustomersUseCase implements IUseCase<SegmentCustomersCommand, SegmentCustomersResult> {
  constructor(
    private readonly repository: IEmailSubscriberRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: SegmentCustomersCommand): Promise<SegmentCustomersResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for SegmentCustomers.");
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
        message: "SegmentCustomers executed successfully on existing EmailSubscriber.",
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
      message: "SegmentCustomers created new EmailSubscriber successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
