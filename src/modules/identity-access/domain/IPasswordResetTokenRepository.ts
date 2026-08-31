import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PasswordResetToken } from "./PasswordResetToken.ts";

export interface IPasswordResetTokenFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPasswordResetTokenRepository extends IRepository<PasswordResetToken> {
  findByName(name: string): Promise<PasswordResetToken | null>;
  findByCode?(code: string): Promise<PasswordResetToken | null>;
  findFiltered(options?: IPasswordResetTokenFilterOptions): Promise<PasswordResetToken[]>;
  count(options?: IPasswordResetTokenFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PasswordResetToken[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
