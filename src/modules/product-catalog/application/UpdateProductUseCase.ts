import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IProductVariantRepository } from "../domain/IProductVariantRepository.ts";
import { ProductVariant } from "../domain/ProductVariant.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface UpdateProductCommand {
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

export interface UpdateProductResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: UpdateProduct
 * Coordinates business flow and state transformations for UpdateProduct.
 */
export class UpdateProductUseCase implements IUseCase<UpdateProductCommand, UpdateProductResult> {
  constructor(
    private readonly repository: IProductVariantRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: UpdateProductCommand): Promise<UpdateProductResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for UpdateProduct.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ProductVariant", command.id);
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
        message: "UpdateProduct executed successfully on existing ProductVariant.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ProductVariant with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ProductVariant.create({
      name: command.name ?? "ProductVariant-Item",
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
      message: "UpdateProduct created new ProductVariant successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
