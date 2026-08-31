import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import type { IPasswordResetTokenRepository } from "../domain/IPasswordResetTokenRepository.ts";
import { PasswordResetToken } from "../domain/PasswordResetToken.ts";
import { NotFoundError, ValidationError, ConflictError } from "../../../shared/errors/DomainError.ts";

export interface EnableMfaCommand {
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

export interface EnableMfaResult {
  readonly success: boolean;
  readonly message: string;
  readonly entityId?: string;
  readonly data?: Record<string, any>;
  readonly timestamp: string;
}

/**
 * UseCase: EnableMfa
 * Coordinates business flow and state transformations for EnableMfa.
 */
export class EnableMfaUseCase implements IUseCase<EnableMfaCommand, EnableMfaResult> {
  constructor(
    private readonly repository: IPasswordResetTokenRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: EnableMfaCommand): Promise<EnableMfaResult> {
    if (!command) {
      throw new ValidationError("Command payload is required for EnableMfa.");
    }

    if (command.id) {
      const existing = await this.repository.findById(command.id);
      if (!existing) {
        throw new NotFoundError("PasswordResetToken", command.id);
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
        message: "EnableMfa executed successfully on existing PasswordResetToken.",
        entityId: existing.id,
        data: existing.toJSON(),
        timestamp: new Date().toISOString(),
      };
    }

    if (command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate) {
        throw new ConflictError(`PasswordResetToken with name '${command.name}' already exists.`);
      }
    }

    const newEntity = PasswordResetToken.create({
      name: command.name ?? "PasswordResetToken-Item",
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
      message: "EnableMfa created new PasswordResetToken successfully.",
      entityId: newEntity.id,
      data: newEntity.toJSON(),
      timestamp: new Date().toISOString(),
    };
  }
}
