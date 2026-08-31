import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ICmsPageRepository } from "../domain/ICmsPageRepository.ts";
import { CmsPage } from "../domain/CmsPage.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface UploadCmsMediaCommand {
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

export interface UploadCmsMediaResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: UploadCmsMedia
 * Coordinates business flow and state transformations for UploadCmsMedia.
 */
export class UploadCmsMediaUseCase implements IUseCase<UploadCmsMediaCommand, UploadCmsMediaResult> {
  constructor(
    private readonly repository: ICmsPageRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: UploadCmsMediaCommand): Promise<UploadCmsMediaResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for UploadCmsMedia.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("CmsPage", command.id);
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
        message: "UploadCmsMedia executed successfully on existing CmsPage.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`CmsPage with name '${command.name}' already exists.`);
      }
    }

    const newEntity = CmsPage.create({
      name: command.name ?? "CmsPage-Item",
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
      message: "UploadCmsMedia created new CmsPage successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
