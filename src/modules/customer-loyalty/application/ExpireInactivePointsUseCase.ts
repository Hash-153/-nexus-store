import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IPointsExpirationPolicyRepository } from "../domain/IPointsExpirationPolicyRepository.ts";
import { PointsExpirationPolicy } from "../domain/PointsExpirationPolicy.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ExpireInactivePointsCommand {
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

export interface ExpireInactivePointsResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ExpireInactivePoints
 * Coordinates business flow and state transformations for ExpireInactivePoints.
 */
export class ExpireInactivePointsUseCase implements IUseCase<ExpireInactivePointsCommand, ExpireInactivePointsResult> {
  constructor(
    private readonly repository: IPointsExpirationPolicyRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ExpireInactivePointsCommand): Promise<ExpireInactivePointsResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ExpireInactivePoints.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("PointsExpirationPolicy", command.id);
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
        message: "ExpireInactivePoints executed successfully on existing PointsExpirationPolicy.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`PointsExpirationPolicy with name '${command.name}' already exists.`);
      }
    }

    const newEntity = PointsExpirationPolicy.create({
      name: command.name ?? "PointsExpirationPolicy-Item",
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
      message: "ExpireInactivePoints created new PointsExpirationPolicy successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
