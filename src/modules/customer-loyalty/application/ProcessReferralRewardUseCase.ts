import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IRewardVoucherRepository } from "../domain/IRewardVoucherRepository.ts";
import { RewardVoucher } from "../domain/RewardVoucher.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface ProcessReferralRewardCommand {
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

export interface ProcessReferralRewardResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: ProcessReferralReward
 * Coordinates business flow and state transformations for ProcessReferralReward.
 */
export class ProcessReferralRewardUseCase implements IUseCase<ProcessReferralRewardCommand, ProcessReferralRewardResult> {
  constructor(
    private readonly repository: IRewardVoucherRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ProcessReferralRewardCommand): Promise<ProcessReferralRewardResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for ProcessReferralReward.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("RewardVoucher", command.id);
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
        message: "ProcessReferralReward executed successfully on existing RewardVoucher.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`RewardVoucher with name '${command.name}' already exists.`);
      }
    }

    const newEntity = RewardVoucher.create({
      name: command.name ?? "RewardVoucher-Item",
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
      message: "ProcessReferralReward created new RewardVoucher successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
