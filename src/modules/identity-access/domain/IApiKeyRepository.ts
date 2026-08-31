import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ApiKey } from "./ApiKey.ts";

export interface IApiKeyFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IApiKeyRepository extends IRepository<ApiKey> {
  findByName(name: string): Promise<ApiKey | null>;
  findByCode?(code: string): Promise<ApiKey | null>;
  findFiltered(options?: IApiKeyFilterOptions): Promise<ApiKey[]>;
  count(options?: IApiKeyFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ApiKey[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
