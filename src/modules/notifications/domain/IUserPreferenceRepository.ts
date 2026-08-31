import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { UserPreference } from "./UserPreference.ts";

export interface IUserPreferenceFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IUserPreferenceRepository extends IRepository<UserPreference> {
  findByName(name: string): Promise<UserPreference | null>;
  findByCode?(code: string): Promise<UserPreference | null>;
  findFiltered(options?: IUserPreferenceFilterOptions): Promise<UserPreference[]>;
  count(options?: IUserPreferenceFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: UserPreference[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
