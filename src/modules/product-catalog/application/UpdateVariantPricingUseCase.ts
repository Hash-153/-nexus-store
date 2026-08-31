import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IProductAttributeRepository } from "../domain/IProductAttributeRepository.ts";
import { ProductAttribute } from "../domain/ProductAttribute.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface UpdateVariantPricingCommand {
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

export interface UpdateVariantPricingResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: UpdateVariantPricing
 * Coordinates business flow and state transformations for UpdateVariantPricing.
 */
export class UpdateVariantPricingUseCase implements IUseCase<UpdateVariantPricingCommand, UpdateVariantPricingResult> {
  constructor(
    private readonly repository: IProductAttributeRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: UpdateVariantPricingCommand): Promise<UpdateVariantPricingResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for UpdateVariantPricing.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ProductAttribute", command.id);
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
        message: "UpdateVariantPricing executed successfully on existing ProductAttribute.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ProductAttribute with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ProductAttribute.create({
      name: command.name ?? "ProductAttribute-Item",
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
      message: "UpdateVariantPricing created new ProductAttribute successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
