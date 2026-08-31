import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { UserProfile } from "./UserProfile.ts";

export interface IUserProfileFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IUserProfileRepository extends IRepository<UserProfile> {
  findByName(name: string): Promise<UserProfile | null>;
  findByCode?(code: string): Promise<UserProfile | null>;
  findFiltered(options?: IUserProfileFilterOptions): Promise<UserProfile[]>;
  count(options?: IUserProfileFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: UserProfile[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
