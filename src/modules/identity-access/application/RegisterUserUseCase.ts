import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { RegisterUserDTO, UserResponseDTO } from "./dtos/AuthDTOs.ts";
import type { IUserRepository } from "../domain/IUserRepository.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Email } from "../../../shared/domain/value-objects/Email.ts";
import { CryptoUtils } from "../../../shared/infrastructure/CryptoUtils.ts";
import { User } from "../domain/User.ts";
import { ConflictError, ValidationError } from "../../../shared/errors/DomainError.ts";

export class RegisterUserUseCase implements IUseCase<RegisterUserDTO, UserResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(dto: RegisterUserDTO): Promise<UserResponseDTO> {
    if (!dto.password || dto.password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters long.");
    }

    const email = Email.create(dto.email);
    const existing = await this.userRepository.findByEmail(email.value);
    if (existing) {
      throw new ConflictError(`User with email '${email.value}' already exists.`);
    }

    const { hash, salt } = CryptoUtils.hashPassword(dto.password);

    const user = User.create({
      email,
      passwordHash: hash,
      passwordSalt: salt,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
    });

    await this.userRepository.save(user);
    await this.eventBus.publishAll(user.domainEvents);
    user.clearEvents();

    return {
      id: user.id,
      email: user.email.value,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
