import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ICarrierRepository } from "../domain/ICarrierRepository.ts";
import { Carrier } from "../domain/Carrier.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface CalculateShippingRatesCommand {
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

export interface CalculateShippingRatesResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: CalculateShippingRates
 * Coordinates business flow and state transformations for CalculateShippingRates.
 */
export class CalculateShippingRatesUseCase implements IUseCase<CalculateShippingRatesCommand, CalculateShippingRatesResult> {
  constructor(
    private readonly repository: ICarrierRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CalculateShippingRatesCommand): Promise<CalculateShippingRatesResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for CalculateShippingRates.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("Carrier", command.id);
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
        message: "CalculateShippingRates executed successfully on existing Carrier.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`Carrier with name '${command.name}' already exists.`);
      }
    }

    const newEntity = Carrier.create({
      name: command.name ?? "Carrier-Item",
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
      message: "CalculateShippingRates created new Carrier successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
