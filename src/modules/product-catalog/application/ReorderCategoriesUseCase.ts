import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IProductMediaRepository } from "../domain/IProductMediaRepository.ts";
import { ProductMedia } from "../domain/ProductMedia.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ReorderCategoriesCommand {
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

export interface ReorderCategoriesResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ReorderCategories
 * Coordinates business flow and state transformations for ReorderCategories.
 */
export class ReorderCategoriesUseCase implements IUseCase<ReorderCategoriesCommand, ReorderCategoriesResult> {
  constructor(
    private readonly repository: IProductMediaRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ReorderCategoriesCommand): Promise<ReorderCategoriesResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ReorderCategories.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ProductMedia", command.id);
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
        message: "ReorderCategories executed successfully on existing ProductMedia.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ProductMedia with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ProductMedia.create({
      name: command.name ?? "ProductMedia-Item",
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
      message: "ReorderCategories created new ProductMedia successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
