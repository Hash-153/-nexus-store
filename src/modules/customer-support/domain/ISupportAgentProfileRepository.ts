import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { SupportAgentProfile } from "./SupportAgentProfile.ts";

export interface ISupportAgentProfileFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ISupportAgentProfileRepository extends IRepository<SupportAgentProfile> {
  findByName(name: string): Promise<SupportAgentProfile | null>;
  findByCode?(code: string): Promise<SupportAgentProfile | null>;
  findFiltered(options?: ISupportAgentProfileFilterOptions): Promise<SupportAgentProfile[]>;
  count(options?: ISupportAgentProfileFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: SupportAgentProfile[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
