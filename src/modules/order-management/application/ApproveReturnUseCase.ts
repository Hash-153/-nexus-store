import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IReturnItemRepository } from "../domain/IReturnItemRepository.ts";
import { ReturnItem } from "../domain/ReturnItem.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ApproveReturnCommand {
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

export interface ApproveReturnResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ApproveReturn
 * Coordinates business flow and state transformations for ApproveReturn.
 */
export class ApproveReturnUseCase implements IUseCase<ApproveReturnCommand, ApproveReturnResult> {
  constructor(
    private readonly repository: IReturnItemRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ApproveReturnCommand): Promise<ApproveReturnResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ApproveReturn.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ReturnItem", command.id);
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
        message: "ApproveReturn executed successfully on existing ReturnItem.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ReturnItem with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ReturnItem.create({
      name: command.name ?? "ReturnItem-Item",
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
      message: "ApproveReturn created new ReturnItem successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
