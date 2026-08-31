import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IBlogPostRepository } from "../domain/IBlogPostRepository.ts";
import { BlogPost } from "../domain/BlogPost.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface UpdateCmsPageCommand {
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

export interface UpdateCmsPageResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: UpdateCmsPage
 * Coordinates business flow and state transformations for UpdateCmsPage.
 */
export class UpdateCmsPageUseCase implements IUseCase<UpdateCmsPageCommand, UpdateCmsPageResult> {
  constructor(
    private readonly repository: IBlogPostRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: UpdateCmsPageCommand): Promise<UpdateCmsPageResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for UpdateCmsPage.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("BlogPost", command.id);
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
        message: "UpdateCmsPage executed successfully on existing BlogPost.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`BlogPost with name '${command.name}' already exists.`);
      }
    }

    const newEntity = BlogPost.create({
      name: command.name ?? "BlogPost-Item",
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
      message: "UpdateCmsPage created new BlogPost successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
