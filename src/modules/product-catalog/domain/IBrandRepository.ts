import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Brand } from "./Brand.ts";

export interface IBrandFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IBrandRepository extends IRepository<Brand> {
  findByName(name: string): Promise<Brand | null>;
  findByCode?(code: string): Promise<Brand | null>;
  findFiltered(options?: IBrandFilterOptions): Promise<Brand[]>;
  count(options?: IBrandFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: Brand[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
