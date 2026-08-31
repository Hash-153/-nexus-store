import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IBannerSliderRepository } from "../domain/IBannerSliderRepository.ts";
import { BannerSlider } from "../domain/BannerSlider.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface PublishCmsPageCommand {
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

export interface PublishCmsPageResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: PublishCmsPage
 * Coordinates business flow and state transformations for PublishCmsPage.
 */
export class PublishCmsPageUseCase implements IUseCase<PublishCmsPageCommand, PublishCmsPageResult> {
  constructor(
    private readonly repository: IBannerSliderRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: PublishCmsPageCommand): Promise<PublishCmsPageResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for PublishCmsPage.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("BannerSlider", command.id);
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
        message: "PublishCmsPage executed successfully on existing BannerSlider.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`BannerSlider with name '${command.name}' already exists.`);
      }
    }

    const newEntity = BannerSlider.create({
      name: command.name ?? "BannerSlider-Item",
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
      message: "PublishCmsPage created new BannerSlider successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
