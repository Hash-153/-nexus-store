import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IFacetFilterRepository } from "../domain/IFacetFilterRepository.ts";
import { FacetFilter } from "../domain/FacetFilter.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ManageAttributesCommand {
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

export interface ManageAttributesResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ManageAttributes
 * Coordinates business flow and state transformations for ManageAttributes.
 */
export class ManageAttributesUseCase implements IUseCase<ManageAttributesCommand, ManageAttributesResult> {
  constructor(
    private readonly repository: IFacetFilterRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ManageAttributesCommand): Promise<ManageAttributesResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ManageAttributes.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("FacetFilter", command.id);
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
        message: "ManageAttributes executed successfully on existing FacetFilter.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`FacetFilter with name '${command.name}' already exists.`);
      }
    }

    const newEntity = FacetFilter.create({
      name: command.name ?? "FacetFilter-Item",
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
      message: "ManageAttributes created new FacetFilter successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
