import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

export class CryptoUtils {
  private static readonly ITERATIONS = 100000;
  private static readonly KEY_LENGTH = 64;
  private static readonly DIGEST = "sha512";

  public static hashPassword(password: string): { hash: string; salt: string } {
    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync(
      password,
      salt,
      CryptoUtils.ITERATIONS,
      CryptoUtils.KEY_LENGTH,
      CryptoUtils.DIGEST
    ).toString("hex");
    return { hash, salt };
  }

  public static verifyPassword(password: string, hash: string, salt: string): boolean {
    const derivedHash = pbkdf2Sync(
      password,
      salt,
      CryptoUtils.ITERATIONS,
      CryptoUtils.KEY_LENGTH,
      CryptoUtils.DIGEST
    ).toString("hex");

    const hashBuffer = Buffer.from(hash, "hex");
    const derivedBuffer = Buffer.from(derivedHash, "hex");

    if (hashBuffer.length !== derivedBuffer.length) {
      return false;
    }

    return timingSafeEqual(hashBuffer, derivedBuffer);
  }

  public static generateSecureToken(byteLength: number = 32): string {
    return randomBytes(byteLength).toString("hex");
  }
}
