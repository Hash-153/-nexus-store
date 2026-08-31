import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ReturnRequest } from "./ReturnRequest.ts";

export interface IReturnRequestFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IReturnRequestRepository extends IRepository<ReturnRequest> {
  findByName(name: string): Promise<ReturnRequest | null>;
  findByCode?(code: string): Promise<ReturnRequest | null>;
  findFiltered(options?: IReturnRequestFilterOptions): Promise<ReturnRequest[]>;
  count(options?: IReturnRequestFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ReturnRequest[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
