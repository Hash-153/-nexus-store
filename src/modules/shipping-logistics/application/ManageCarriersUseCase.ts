import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ICustomsDeclarationRepository } from "../domain/ICustomsDeclarationRepository.ts";
import { CustomsDeclaration } from "../domain/CustomsDeclaration.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ManageCarriersCommand {
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

export interface ManageCarriersResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ManageCarriers
 * Coordinates business flow and state transformations for ManageCarriers.
 */
export class ManageCarriersUseCase implements IUseCase<ManageCarriersCommand, ManageCarriersResult> {
  constructor(
    private readonly repository: ICustomsDeclarationRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ManageCarriersCommand): Promise<ManageCarriersResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ManageCarriers.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("CustomsDeclaration", command.id);
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
        message: "ManageCarriers executed successfully on existing CustomsDeclaration.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`CustomsDeclaration with name '${command.name}' already exists.`);
      }
    }

    const newEntity = CustomsDeclaration.create({
      name: command.name ?? "CustomsDeclaration-Item",
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
      message: "ManageCarriers created new CustomsDeclaration successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
