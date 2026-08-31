import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IBrandRepository } from "../domain/IBrandRepository.ts";
import { Brand } from "../domain/Brand.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface FilterProductsByFacetsCommand {
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

export interface FilterProductsByFacetsResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: FilterProductsByFacets
 * Coordinates business flow and state transformations for FilterProductsByFacets.
 */
export class FilterProductsByFacetsUseCase implements IUseCase<FilterProductsByFacetsCommand, FilterProductsByFacetsResult> {
  constructor(
    private readonly repository: IBrandRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: FilterProductsByFacetsCommand): Promise<FilterProductsByFacetsResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for FilterProductsByFacets.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("Brand", command.id);
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
        message: "FilterProductsByFacets executed successfully on existing Brand.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`Brand with name '${command.name}' already exists.`);
      }
    }

    const newEntity = Brand.create({
      name: command.name ?? "Brand-Item",
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
      message: "FilterProductsByFacets created new Brand successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
