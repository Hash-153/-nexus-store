import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { DataDeletionRequest } from "./DataDeletionRequest.ts";

export interface IDataDeletionRequestFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IDataDeletionRequestRepository extends IRepository<DataDeletionRequest> {
  findByName(name: string): Promise<DataDeletionRequest | null>;
  findByCode?(code: string): Promise<DataDeletionRequest | null>;
  findFiltered(options?: IDataDeletionRequestFilterOptions): Promise<DataDeletionRequest[]>;
  count(options?: IDataDeletionRequestFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: DataDeletionRequest[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
