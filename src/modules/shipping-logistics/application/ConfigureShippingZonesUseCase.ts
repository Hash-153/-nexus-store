import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IPickupLocationRepository } from "../domain/IPickupLocationRepository.ts";
import { PickupLocation } from "../domain/PickupLocation.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ConfigureShippingZonesCommand {
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

export interface ConfigureShippingZonesResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ConfigureShippingZones
 * Coordinates business flow and state transformations for ConfigureShippingZones.
 */
export class ConfigureShippingZonesUseCase implements IUseCase<ConfigureShippingZonesCommand, ConfigureShippingZonesResult> {
  constructor(
    private readonly repository: IPickupLocationRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ConfigureShippingZonesCommand): Promise<ConfigureShippingZonesResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ConfigureShippingZones.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("PickupLocation", command.id);
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
        message: "ConfigureShippingZones executed successfully on existing PickupLocation.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`PickupLocation with name '${command.name}' already exists.`);
      }
    }

    const newEntity = PickupLocation.create({
      name: command.name ?? "PickupLocation-Item",
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
      message: "ConfigureShippingZones created new PickupLocation successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
