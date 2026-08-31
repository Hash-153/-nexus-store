import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { INavigationMenuRepository } from "../domain/INavigationMenuRepository.ts";
import { NavigationMenu } from "../domain/NavigationMenu.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface PublishBlogPostCommand {
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

export interface PublishBlogPostResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: PublishBlogPost
 * Coordinates business flow and state transformations for PublishBlogPost.
 */
export class PublishBlogPostUseCase implements IUseCase<PublishBlogPostCommand, PublishBlogPostResult> {
  constructor(
    private readonly repository: INavigationMenuRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: PublishBlogPostCommand): Promise<PublishBlogPostResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for PublishBlogPost.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("NavigationMenu", command.id);
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
        message: "PublishBlogPost executed successfully on existing NavigationMenu.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`NavigationMenu with name '${command.name}' already exists.`);
      }
    }

    const newEntity = NavigationMenu.create({
      name: command.name ?? "NavigationMenu-Item",
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
      message: "PublishBlogPost created new NavigationMenu successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
