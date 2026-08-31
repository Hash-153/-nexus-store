import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IProductTagRepository } from "../domain/IProductTagRepository.ts";
import { ProductTag } from "../domain/ProductTag.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface AddProductToCollectionCommand {
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

export interface AddProductToCollectionResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: AddProductToCollection
 * Coordinates business flow and state transformations for AddProductToCollection.
 */
export class AddProductToCollectionUseCase implements IUseCase<AddProductToCollectionCommand, AddProductToCollectionResult> {
  constructor(
    private readonly repository: IProductTagRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: AddProductToCollectionCommand): Promise<AddProductToCollectionResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for AddProductToCollection.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ProductTag", command.id);
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
        message: "AddProductToCollection executed successfully on existing ProductTag.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ProductTag with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ProductTag.create({
      name: command.name ?? "ProductTag-Item",
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
      message: "AddProductToCollection created new ProductTag successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
