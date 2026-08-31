import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IMediaAssetRepository } from "../domain/IMediaAssetRepository.ts";
import { MediaAsset } from "../domain/MediaAsset.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ManageNavigationMenuCommand {
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

export interface ManageNavigationMenuResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ManageNavigationMenu
 * Coordinates business flow and state transformations for ManageNavigationMenu.
 */
export class ManageNavigationMenuUseCase implements IUseCase<ManageNavigationMenuCommand, ManageNavigationMenuResult> {
  constructor(
    private readonly repository: IMediaAssetRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ManageNavigationMenuCommand): Promise<ManageNavigationMenuResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ManageNavigationMenu.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("MediaAsset", command.id);
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
        message: "ManageNavigationMenu executed successfully on existing MediaAsset.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`MediaAsset with name '${command.name}' already exists.`);
      }
    }

    const newEntity = MediaAsset.create({
      name: command.name ?? "MediaAsset-Item",
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
      message: "ManageNavigationMenu created new MediaAsset successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
