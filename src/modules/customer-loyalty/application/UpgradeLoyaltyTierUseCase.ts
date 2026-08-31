import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IReferralRecordRepository } from "../domain/IReferralRecordRepository.ts";
import { ReferralRecord } from "../domain/ReferralRecord.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface UpgradeLoyaltyTierCommand {
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

export interface UpgradeLoyaltyTierResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: UpgradeLoyaltyTier
 * Coordinates business flow and state transformations for UpgradeLoyaltyTier.
 */
export class UpgradeLoyaltyTierUseCase implements IUseCase<UpgradeLoyaltyTierCommand, UpgradeLoyaltyTierResult> {
  constructor(
    private readonly repository: IReferralRecordRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: UpgradeLoyaltyTierCommand): Promise<UpgradeLoyaltyTierResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for UpgradeLoyaltyTier.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("ReferralRecord", command.id);
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
        message: "UpgradeLoyaltyTier executed successfully on existing ReferralRecord.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`ReferralRecord with name '${command.name}' already exists.`);
      }
    }

    const newEntity = ReferralRecord.create({
      name: command.name ?? "ReferralRecord-Item",
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
      message: "UpgradeLoyaltyTier created new ReferralRecord successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
