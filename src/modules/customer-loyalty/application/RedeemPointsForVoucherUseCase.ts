import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { ILoyaltyTierRepository } from "../domain/ILoyaltyTierRepository.ts";
import { LoyaltyTier } from "../domain/LoyaltyTier.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface RedeemPointsForVoucherCommand {
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

export interface RedeemPointsForVoucherResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: RedeemPointsForVoucher
 * Coordinates business flow and state transformations for RedeemPointsForVoucher.
 */
export class RedeemPointsForVoucherUseCase implements IUseCase<RedeemPointsForVoucherCommand, RedeemPointsForVoucherResult> {
  constructor(
    private readonly repository: ILoyaltyTierRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: RedeemPointsForVoucherCommand): Promise<RedeemPointsForVoucherResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for RedeemPointsForVoucher.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("LoyaltyTier", command.id);
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
        message: "RedeemPointsForVoucher executed successfully on existing LoyaltyTier.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`LoyaltyTier with name '${command.name}' already exists.`);
      }
    }

    const newEntity = LoyaltyTier.create({
      name: command.name ?? "LoyaltyTier-Item",
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
      message: "RedeemPointsForVoucher created new LoyaltyTier successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
