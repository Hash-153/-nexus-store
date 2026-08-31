import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { FacetFilter } from "./FacetFilter.ts";

export interface IFacetFilterFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IFacetFilterRepository extends IRepository<FacetFilter> {
  findByName(name: string): Promise<FacetFilter | null>;
  findByCode?(code: string): Promise<FacetFilter | null>;
  findFiltered(options?: IFacetFilterFilterOptions): Promise<FacetFilter[]>;
  count(options?: IFacetFilterFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: FacetFilter[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
