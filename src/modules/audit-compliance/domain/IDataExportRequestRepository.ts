import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { DataExportRequest } from "./DataExportRequest.ts";

export interface IDataExportRequestFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IDataExportRequestRepository extends IRepository<DataExportRequest> {
  findByName(name: string): Promise<DataExportRequest | null>;
  findByCode?(code: string): Promise<DataExportRequest | null>;
  findFiltered(options?: IDataExportRequestFilterOptions): Promise<DataExportRequest[]>;
  count(options?: IDataExportRequestFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: DataExportRequest[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
