import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IPointsLedgerEntryRepository } from "../domain/IPointsLedgerEntryRepository.ts";
import { PointsLedgerEntry } from "../domain/PointsLedgerEntry.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface AwardPointsForPurchaseCommand {
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

export interface AwardPointsForPurchaseResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: AwardPointsForPurchase
 * Coordinates business flow and state transformations for AwardPointsForPurchase.
 */
export class AwardPointsForPurchaseUseCase implements IUseCase<AwardPointsForPurchaseCommand, AwardPointsForPurchaseResult> {
  constructor(
    private readonly repository: IPointsLedgerEntryRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: AwardPointsForPurchaseCommand): Promise<AwardPointsForPurchaseResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for AwardPointsForPurchase.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("PointsLedgerEntry", command.id);
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
        message: "AwardPointsForPurchase executed successfully on existing PointsLedgerEntry.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`PointsLedgerEntry with name '${command.name}' already exists.`);
      }
    }

    const newEntity = PointsLedgerEntry.create({
      name: command.name ?? "PointsLedgerEntry-Item",
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
      message: "AwardPointsForPurchase created new PointsLedgerEntry successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
