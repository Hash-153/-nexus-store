import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CannedResponse } from "./CannedResponse.ts";

export interface ICannedResponseFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICannedResponseRepository extends IRepository<CannedResponse> {
  findByName(name: string): Promise<CannedResponse | null>;
  findByCode?(code: string): Promise<CannedResponse | null>;
  findFiltered(options?: ICannedResponseFilterOptions): Promise<CannedResponse[]>;
  count(options?: ICannedResponseFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CannedResponse[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
