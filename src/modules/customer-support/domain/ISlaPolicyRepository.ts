import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { SlaPolicy } from "./SlaPolicy.ts";

export interface ISlaPolicyFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ISlaPolicyRepository extends IRepository<SlaPolicy> {
  findByName(name: string): Promise<SlaPolicy | null>;
  findByCode?(code: string): Promise<SlaPolicy | null>;
  findFiltered(options?: ISlaPolicyFilterOptions): Promise<SlaPolicy[]>;
  count(options?: ISlaPolicyFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: SlaPolicy[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
