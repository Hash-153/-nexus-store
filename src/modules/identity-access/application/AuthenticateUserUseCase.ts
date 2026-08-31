import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { AuthenticateUserDTO, AuthSessionDTO } from "./dtos/AuthDTOs.ts";
import type { IUserRepository } from "../domain/IUserRepository.ts";
import { CryptoUtils } from "../../../shared/infrastructure/CryptoUtils.ts";
import { UnauthorizedError } from "../../../shared/errors/DomainError.ts";

export class AuthenticateUserUseCase implements IUseCase<AuthenticateUserDTO, AuthSessionDTO> {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(dto: AuthenticateUserDTO): Promise<AuthSessionDTO> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("User account is inactive.");
    }

    const isValid = CryptoUtils.verifyPassword(dto.password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    user.recordLogin();
    await this.userRepository.save(user);

    const token = CryptoUtils.generateSecureToken(32);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    return {
      token,
      user: {
        id: user.id,
        email: user.email.value,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt.toISOString(),
      },
      expiresAt: expiresAt.toISOString(),
    };
  }
}
