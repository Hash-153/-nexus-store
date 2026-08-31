import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { MfaConfig } from "./MfaConfig.ts";

export interface IMfaConfigFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IMfaConfigRepository extends IRepository<MfaConfig> {
  findByName(name: string): Promise<MfaConfig | null>;
  findByCode?(code: string): Promise<MfaConfig | null>;
  findFiltered(options?: IMfaConfigFilterOptions): Promise<MfaConfig[]>;
  count(options?: IMfaConfigFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: MfaConfig[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
