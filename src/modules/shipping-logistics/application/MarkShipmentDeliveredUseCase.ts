import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IBoxPackageRepository } from "../domain/IBoxPackageRepository.ts";
import { BoxPackage } from "../domain/BoxPackage.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface MarkShipmentDeliveredCommand {
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

export interface MarkShipmentDeliveredResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: MarkShipmentDelivered
 * Coordinates business flow and state transformations for MarkShipmentDelivered.
 */
export class MarkShipmentDeliveredUseCase implements IUseCase<MarkShipmentDeliveredCommand, MarkShipmentDeliveredResult> {
  constructor(
    private readonly repository: IBoxPackageRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: MarkShipmentDeliveredCommand): Promise<MarkShipmentDeliveredResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for MarkShipmentDelivered.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("BoxPackage", command.id);
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
        message: "MarkShipmentDelivered executed successfully on existing BoxPackage.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`BoxPackage with name '${command.name}' already exists.`);
      }
    }

    const newEntity = BoxPackage.create({
      name: command.name ?? "BoxPackage-Item",
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
      message: "MarkShipmentDelivered created new BoxPackage successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
